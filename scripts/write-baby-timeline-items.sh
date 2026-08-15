#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
script_path="${script_dir}/$(basename -- "${BASH_SOURCE[0]}")"

if [[ -n "${BABY_SITE_REPO:-}" ]]; then
  repo_dir="$BABY_SITE_REPO"
elif [[ -f "${script_dir}/../timeline-data.js" ]]; then
  repo_dir="${script_dir}/.."
elif [[ -f "${script_dir}/baby-site/timeline-data.js" ]]; then
  repo_dir="${script_dir}/baby-site"
else
  repo_dir="${script_dir}/../baby-site"
fi

list_only=false
resume_active=false
scope="all"
item_filter=""
limit=0

usage() {
  cat <<'EOF'
Usage: write-baby-timeline-items.sh [OPTIONS]

Runs one persisted Codex session per unfinished Baby Site timeline work item.
A topic item covers all dated cards on one topic page; a homepage item covers
one dated homepage card. Topic items run first so homepage summaries can be
reviewed against finished topic guidance.

Options:
  --list              Print the pending queue without starting Codex.
  --item ID           Run only one stable ID, such as topic/getting-enough or home/day-3.
  --scope SCOPE       Limit the queue to all, topics, or home (default: all).
  --limit COUNT       Run at most COUNT pending items.
  --resume            Resume the exact Codex session left by a failed/interrupted run.
  --repo PATH         Use a baby-site checkout at PATH.
  -h, --help          Show this help.

Environment:
  BABY_SITE_REPO                  Alternative repository path.
  BABY_SITE_TIMELINE_LOG_DIR      Alternative directory for session logs.
EOF
}

die() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

while (($#)); do
  case "$1" in
    --list)
      list_only=true
      shift
      ;;
    --item)
      (($# >= 2)) || die "--item requires an ID"
      [[ -n "$2" ]] || die "--item requires a non-empty ID"
      item_filter="$2"
      shift 2
      ;;
    --scope)
      (($# >= 2)) || die "--scope requires all, topics, or home"
      scope="$2"
      shift 2
      ;;
    --limit)
      (($# >= 2)) || die "--limit requires a positive integer"
      [[ "$2" =~ ^[1-9][0-9]*$ ]] || die "--limit requires a positive integer"
      limit="$2"
      shift 2
      ;;
    --resume)
      resume_active=true
      shift
      ;;
    --repo)
      (($# >= 2)) || die "--repo requires a path"
      repo_dir="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf 'Error: unknown argument: %s\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

case "$scope" in
  all|topics|home) ;;
  *) die "--scope must be all, topics, or home" ;;
esac

if [[ "$resume_active" == true ]] && { [[ "$list_only" == true ]] || [[ -n "$item_filter" ]] || [[ "$scope" != all ]] || ((limit != 0)); }; then
  die "--resume cannot be combined with --list, --item, --scope, or --limit"
fi
if [[ -n "$item_filter" && "$scope" != all ]]; then
  die "--item cannot be combined with --scope"
fi

for command_name in git node; do
  command -v "$command_name" >/dev/null 2>&1 || die "required command not found: $command_name"
done

repo_dir="$(cd -- "$repo_dir" 2>/dev/null && pwd -P)" || die "repository directory does not exist: $repo_dir"
helper="${repo_dir}/scripts/timeline-items.js"

if [[ ! -f "${repo_dir}/index.html" ]] ||
   [[ ! -f "${repo_dir}/timeline-data.js" ]] ||
   [[ ! -f "${repo_dir}/timeline-review-progress.json" ]] ||
   [[ ! -f "$helper" ]] ||
   ! git -C "$repo_dir" rev-parse --git-dir >/dev/null 2>&1; then
  die "not a timeline-enabled baby-site Git checkout: $repo_dir"
fi

declare -a queue_ids=()
declare -a queue_labels=()

load_queue() {
  local _status item_id label _detail _target queue_output
  if ! queue_output="$(node "$helper" list --scope "$scope" --status pending --format tsv)"; then
    die "could not read the pending timeline queue"
  fi
  while IFS=$'\t' read -r _status item_id label _detail _target; do
    [[ -n "$item_id" ]] || continue
    if [[ -n "$item_filter" && "$item_id" != "$item_filter" ]]; then
      continue
    fi
    if ((limit != 0 && ${#queue_ids[@]} >= limit)); then
      continue
    fi
    queue_ids+=("$item_id")
    queue_labels+=("$label")
  done <<<"$queue_output"
}

if [[ "$list_only" == true ]]; then
  node "$helper" validate >/dev/null
  if [[ -n "$item_filter" ]]; then
    node "$helper" verify "$item_filter" >/dev/null
  fi
  load_queue
  if ((${#queue_ids[@]} == 0)); then
    printf 'No pending timeline items found.\n'
    exit 0
  fi
  printf 'Pending timeline items (%d):\n' "${#queue_ids[@]}"
  for ((index = 0; index < ${#queue_ids[@]}; index++)); do
    printf '  %2d. %-38s %s\n' "$((index + 1))" "${queue_ids[index]}" "${queue_labels[index]}"
  done
  exit 0
fi

for command_name in codex flock sha256sum tee; do
  command -v "$command_name" >/dev/null 2>&1 || die "required command not found: $command_name"
done

origin_url="$(git -C "$repo_dir" remote get-url origin)" || die "the repository has no origin remote"
remote_key="$(printf '%s' "$origin_url" | sha256sum)" || die "could not identify the origin remote"
remote_key="${remote_key%% *}"
git_common_dir="$(git -C "$repo_dir" rev-parse --path-format=absolute --git-common-dir)" ||
  die "could not identify the repository's common Git directory"
repo_key="$(printf '%s' "$git_common_dir" | sha256sum)" || die "could not identify the checkout"
repo_key="${repo_key%% *}"
state_root="${XDG_STATE_HOME:-${HOME:?HOME is required}/.local/state}/baby-site-timeline-writer"
mkdir -p "$state_root"
chmod 700 "$state_root"

exec 8>"${git_common_dir}/baby-site-timeline-writer.lock"
flock -n 8 || die "another timeline writer is already using this Git checkout or one of its worktrees"
exec 9>"${state_root}/origin-${remote_key}.lock"
flock -n 9 || die "another timeline writer is already using this origin repository"

log_root="${BABY_SITE_TIMELINE_LOG_DIR:-${HOME:?HOME is required}/baby-site-timeline-item-logs}"
if [[ "$log_root" != /* ]]; then
  log_root="$(pwd -P)/${log_root}"
fi
checkout_active_state="${state_root}/checkout-${repo_key}.active"
origin_active_state="${state_root}/origin-${remote_key}.active"
active_state="$checkout_active_state"

write_active_state() {
  local state_item="$1" state_session="$2" state_log="$3" state_before="$4"
  local state_path temporary_state
  for state_path in "$origin_active_state" "$checkout_active_state"; do
    temporary_state="${state_path}.tmp.$$"
    if ! (umask 077 && printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
      "$state_item" "$state_session" "$state_log" "$state_before" "$repo_dir" "$remote_key" >"$temporary_state"); then
      printf 'Error: could not write active-session state: %s\n' "$temporary_state" >&2
      return 1
    fi
    if ! mv -- "$temporary_state" "$state_path"; then
      printf 'Error: could not publish active-session state: %s\n' "$state_path" >&2
      return 1
    fi
  done
}

read_active_state() {
  if [[ -f "$checkout_active_state" ]]; then
    active_state="$checkout_active_state"
  elif [[ -f "$origin_active_state" ]]; then
    active_state="$origin_active_state"
  else
    die "there is no interrupted timeline session to resume"
  fi
  IFS=$'\t' read -r active_item active_session active_log active_before active_repo active_remote_key <"$active_state"
  [[ -n "$active_item" && -n "$active_session" && -n "$active_log" && -n "$active_before" && -n "$active_repo" && -n "$active_remote_key" ]] ||
    die "active-session state is incomplete: $active_state"
  [[ "$active_repo" == "$repo_dir" ]] ||
    die "active session belongs to a different checkout: $active_repo"
  [[ "$active_before" =~ ^[0-9a-f]{40}$ ]] || die "active session has an invalid baseline SHA"
  [[ "$active_remote_key" == "$remote_key" ]] ||
    die "the origin remote changed since this session started"
  active_state="$checkout_active_state"
}

archive_active_state() {
  local completed_log="$1"
  local state_result="${2:-completed}"
  local archived_state="${completed_log%.log}.${state_result}.tsv"
  local state_to_archive="$checkout_active_state"
  if [[ ! -f "$state_to_archive" ]]; then
    state_to_archive="$origin_active_state"
  fi
  if ! mv -- "$state_to_archive" "$archived_state"; then
    printf 'Error: could not archive active-session state at %s.\n' "$archived_state" >&2
    return 1
  fi
  if [[ -e "$checkout_active_state" ]]; then
    rm -f -- "$checkout_active_state" || return 1
  fi
  if [[ -e "$origin_active_state" ]]; then
    rm -f -- "$origin_active_state" || return 1
  fi
}

require_main() {
  local branch
  branch="$(git -C "$repo_dir" branch --show-current)"
  if [[ "$branch" != main ]]; then
    printf 'Error: expected main, found %s.\n' "${branch:-a detached HEAD}" >&2
    return 1
  fi
}

require_clean() {
  if [[ -n "$(git -C "$repo_dir" status --porcelain --untracked-files=all)" ]]; then
    printf 'Error: the repository has uncommitted changes.\n' >&2
    return 1
  fi
}

fetch_and_require_synced() {
  local expected_sha="${1:-}"
  if ! git -C "$repo_dir" remote get-url origin >/dev/null 2>&1; then
    printf 'Error: the repository has no origin remote.\n' >&2
    return 1
  fi
  local current_origin
  current_origin="$(git -C "$repo_dir" remote get-url origin)" || return 1
  if [[ "$current_origin" != "$origin_url" ]]; then
    printf 'Error: origin changed during the timeline session.\n' >&2
    return 1
  fi
  if ! git -C "$repo_dir" fetch --quiet origin main; then
    printf 'Error: could not fetch origin/main.\n' >&2
    return 1
  fi
  local local_sha remote_sha
  local_sha="$(git -C "$repo_dir" rev-parse HEAD)"
  remote_sha="$(git -C "$repo_dir" rev-parse refs/remotes/origin/main)"
  if [[ "$local_sha" != "$remote_sha" ]]; then
    printf 'Error: main must exactly match origin/main (local %s, remote %s).\n' "$local_sha" "$remote_sha" >&2
    return 1
  fi
  if [[ -n "$expected_sha" && "$local_sha" != "$expected_sha" ]]; then
    printf 'Error: HEAD changed during validation (validated %s, found %s).\n' "$expected_sha" "$local_sha" >&2
    return 1
  fi
}

path_is_allowed() {
  local item_id="$1" path="$2" target_file
  if [[ "$item_id" == topic/* ]]; then
    target_file="topics/${item_id#topic/}.html"
    [[ "$path" == timeline-data.js || "$path" == timeline-review-progress.json || "$path" == "$target_file" ]]
    return
  fi
  [[ "$path" == timeline-data.js || "$path" == timeline-review-progress.json ]]
}

check_changed_paths() {
  local baseline="$1" item_id="$2" path invalid=false paths_output
  if ! paths_output="$(git -C "$repo_dir" log --format= --name-only "$baseline..HEAD")"; then
    printf 'Could not inspect paths changed after %s.\n' "$baseline" >&2
    return 1
  fi

  while IFS= read -r path; do
    [[ -n "$path" ]] || continue
    if ! path_is_allowed "$item_id" "$path"; then
      printf 'Unexpected file changed for %s: %s\n' "$item_id" "$path" >&2
      invalid=true
    fi
  done <<<"$paths_output"
  [[ "$invalid" == false ]]
}

check_worktree_paths() {
  local item_id="$1" path invalid=false paths_output unstaged_paths staged_paths untracked_paths
  unstaged_paths="$(git -C "$repo_dir" diff --name-only)" || return 1
  staged_paths="$(git -C "$repo_dir" diff --cached --name-only)" || return 1
  untracked_paths="$(git -C "$repo_dir" ls-files --others --exclude-standard)" || return 1
  paths_output="$(printf '%s\n%s\n%s\n' "$unstaged_paths" "$staged_paths" "$untracked_paths" | sort -u)" || return 1
  while IFS= read -r path; do
    [[ -n "$path" ]] || continue
    if ! path_is_allowed "$item_id" "$path"; then
      printf 'Unexpected interrupted-worktree file for %s: %s\n' "$item_id" "$path" >&2
      invalid=true
    fi
  done <<<"$paths_output"
  [[ "$invalid" == false ]]
}

postcheck() {
  local baseline="$1" item_id="$2"
  local current_sha

  require_main || return 1
  require_clean || return 1
  current_sha="$(git -C "$repo_dir" rev-parse HEAD)"
  if [[ "$current_sha" == "$baseline" ]]; then
    printf 'The session did not create a completion commit for %s.\n' "$item_id" >&2
    return 1
  fi
  if ! git -C "$repo_dir" merge-base --is-ancestor "$baseline" HEAD; then
    printf 'History was rewritten while processing %s.\n' "$item_id" >&2
    return 1
  fi
  node "$helper" validate || return 1
  node "$helper" verify "$item_id" --completed || return 1
  node "$helper" check-scope "$baseline" "$item_id" || return 1
  node "$helper" check-progress "$baseline" "$item_id" || return 1
  node "$helper" check-files "$baseline" "$item_id" || return 1
  check_changed_paths "$baseline" "$item_id" || return 1
  git -C "$repo_dir" diff --check "$baseline..HEAD" || return 1
  node --check "${repo_dir}/timeline-data.js" || return 1
  node --check "${repo_dir}/timeline.js" || return 1
  node --test "${repo_dir}"/tests/*.test.js || return 1
  require_clean || return 1
  fetch_and_require_synced "$current_sha" || return 1
  [[ "$(git -C "$repo_dir" rev-parse HEAD)" == "$current_sha" ]] || return 1
}

session_from_log() {
  local log_file="$1"
  [[ -f "$log_file" ]] || return 0
  node "$helper" session-id "$log_file"
}

run_codex_session() {
  local item_id="$1" prompt="$2" log_file="$3" mode="$4" session_id="$5"
  local codex_status tee_status parsed_session state_session
  local -a pipeline_status

  set +e
  if [[ "$mode" == resume ]]; then
    codex --search --cd "$repo_dir" exec resume --json "$session_id" "$prompt" 2>&1 | tee -a "$log_file"
  else
    codex --search --cd "$repo_dir" exec --json "$prompt" 2>&1 | tee "$log_file"
  fi
  pipeline_status=("${PIPESTATUS[@]}")
  codex_status=${pipeline_status[0]}
  tee_status=${pipeline_status[1]}
  set -e

  if parsed_session="$(session_from_log "$log_file")"; then
    :
  else
    parsed_session=""
    state_session=unidentified
  fi
  if [[ -n "$parsed_session" ]]; then
    state_session="$parsed_session"
  elif [[ "${state_session:-}" == unidentified ]] || ((tee_status != 0 || codex_status >= 128)); then
    state_session=unidentified
  else
    state_session=not-started
  fi
  write_active_state "$item_id" "$state_session" "$log_file" "$active_before" || return 1

  if ((codex_status != 0)); then
    printf '\nCodex exited with status %d for %s.\n' "$codex_status" "$item_id" >&2
    printf 'Resume this same session with: %q --resume --repo %q\n' "$script_path" "$repo_dir" >&2
    return "$codex_status"
  fi
  if ((tee_status != 0)); then
    printf '\nCould not write the session log for %s (tee status %d).\n' "$item_id" "$tee_status" >&2
    return "$tee_status"
  fi
}

if [[ "$resume_active" == true ]]; then
  read_active_state
  require_main || exit 1
  git -C "$repo_dir" merge-base --is-ancestor "$active_before" HEAD ||
    die "the active session baseline is no longer an ancestor of HEAD"
  check_worktree_paths "$active_item" ||
    die "the interrupted worktree contains files outside the active item; review them before resuming"

  if node "$helper" verify "$active_item" --completed >/dev/null 2>&1 &&
     [[ -z "$(git -C "$repo_dir" status --porcelain --untracked-files=all)" ]]; then
    printf 'The target is already complete; rerunning post-session checks for %s.\n' "$active_item"
    if postcheck "$active_before" "$active_item"; then
      archive_active_state "$active_log"
      printf 'Completed and synchronized: %s\n' "$active_item"
      exit 0
    fi
    printf 'Post-session checks still need repair; returning control to the same Codex session.\n'
  fi

  if [[ "$active_session" == pending || "$active_session" == unidentified ]]; then
    recovered_session="$(session_from_log "$active_log")" || recovered_session=""
    if [[ -n "$recovered_session" ]]; then
      active_session="$recovered_session"
      write_active_state "$active_item" "$active_session" "$active_log" "$active_before" || exit 1
    fi
  fi
  if [[ "$active_session" == not-started ]]; then
    if [[ "$(git -C "$repo_dir" rev-parse HEAD)" == "$active_before" ]] &&
       [[ -z "$(git -C "$repo_dir" status --porcelain --untracked-files=all)" ]] &&
       node "$helper" verify "$active_item" --pending >/dev/null 2>&1; then
      archive_active_state "$active_log" not-started
      printf 'No Codex session was created; safely retrying the same item from its unchanged baseline.\n'
      exec "$script_path" --repo "$repo_dir" --item "$active_item"
    fi
    die "Codex reported no started thread, but the checkout changed; inspect $active_log"
  fi
  if [[ ! "$active_session" =~ ^[0-9a-f-]{36}$ ]]; then
    die "the launch was interrupted before a thread ID was durably logged; refusing to start a second session (inspect $active_log)"
  fi
  resume_prompt="Continue \$write-timeline-item ${active_item}. This is the same batch item and persisted session after an interruption or failed postcondition. The runner-recorded baseline is ${active_before}; use it for every scope and progress check even if the target is already committed or marked complete. Finish the scoped research, edits, validation, completion-ledger entry, commit, and push; resolve any unfinished work you find."
  printf 'Resuming %s in Codex session %s\n' "$active_item" "$active_session"
  if run_codex_session "$active_item" "$resume_prompt" "$active_log" resume "$active_session"; then
    :
  else
    session_status=$?
    exit "$session_status"
  fi

  if ! postcheck "$active_before" "$active_item"; then
    printf '\nPost-session checks failed for %s. The active session was retained.\n' "$active_item" >&2
    printf 'Resume it with: %q --resume --repo %q\n' "$script_path" "$repo_dir" >&2
    exit 1
  fi
  archive_active_state "$active_log"
  printf 'Completed and synchronized: %s\n' "$active_item"
  exit 0
fi

if [[ -e "$checkout_active_state" || -e "$origin_active_state" ]]; then
  die "an interrupted session is recorded for this checkout or origin; run this script with --resume from its owning checkout"
fi

node "$helper" validate >/dev/null
if [[ -n "$item_filter" ]]; then
  node "$helper" verify "$item_filter" >/dev/null
fi
load_queue

require_topics_complete() {
  local pending_topics
  if ! pending_topics="$(node "$helper" list --scope topics --status pending --format ids)"; then
    printf 'Error: could not read pending topic timelines.\n' >&2
    return 1
  fi
  if [[ -n "$pending_topics" ]]; then
    printf 'Error: homepage items require every topic timeline to be completed first.\n' >&2
    return 1
  fi
}

if ((${#queue_ids[@]} > 0)) && [[ "${queue_ids[0]}" == home/* ]]; then
  require_topics_complete || exit 1
fi

require_main || exit 1
require_clean || exit 1
fetch_and_require_synced || exit 1

if ((${#queue_ids[@]} == 0)); then
  if [[ -n "$item_filter" ]]; then
    printf 'Timeline item is already complete: %s\n' "$item_filter"
  else
    printf 'No pending timeline items found.\n'
  fi
  exit 0
fi

printf 'Queued %d timeline item(s):\n' "${#queue_ids[@]}"
for ((index = 0; index < ${#queue_ids[@]}; index++)); do
  printf '  %2d. %-38s %s\n' "$((index + 1))" "${queue_ids[index]}" "${queue_labels[index]}"
done

run_log_dir="${log_root}/$(date '+%Y%m%d-%H%M%S')-$$"
mkdir -p "$run_log_dir"
chmod 700 "$run_log_dir"
printf 'Session logs: %s\n' "$run_log_dir"

for ((index = 0; index < ${#queue_ids[@]}; index++)); do
  item_id="${queue_ids[index]}"
  item_label="${queue_labels[index]}"

  if node "$helper" verify "$item_id" --completed >/dev/null 2>&1; then
    printf '\nSkipping completed item: %s\n' "$item_id"
    continue
  fi
  node "$helper" verify "$item_id" --pending >/dev/null ||
    die "could not verify the next timeline item: $item_id"
  if [[ "$item_id" == home/* ]] &&
     ! require_topics_complete; then
    exit 1
  fi

  require_main || exit 1
  require_clean || exit 1
  fetch_and_require_synced || exit 1
  active_before="$(git -C "$repo_dir" rev-parse HEAD)"
  log_slug="${item_id//\//-}"
  log_file="${run_log_dir}/$(printf '%02d' "$((index + 1))")-${log_slug}.log"
  prompt="\$write-timeline-item ${item_id}"
  write_active_state "$item_id" pending "$log_file" "$active_before" || exit 1

  printf '\n[%d/%d] Starting: %s\n' "$((index + 1))" "${#queue_ids[@]}" "$prompt"
  printf 'Target: %s\nLog: %s\n' "$item_label" "$log_file"

  if run_codex_session "$item_id" "$prompt" "$log_file" new pending; then
    :
  else
    session_status=$?
    exit "$session_status"
  fi
  if ! postcheck "$active_before" "$item_id"; then
    printf '\nPost-session checks failed for %s. The active session was retained.\n' "$item_id" >&2
    printf 'Resume it with: %q --resume --repo %q\n' "$script_path" "$repo_dir" >&2
    exit 1
  fi
  archive_active_state "$log_file"
  printf '[%d/%d] Completed and synchronized: %s\n' "$((index + 1))" "${#queue_ids[@]}" "$item_id"
done

printf '\nAll queued timeline items completed.\n'
