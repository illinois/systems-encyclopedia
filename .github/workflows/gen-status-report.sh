echo "## Workflow summary :rocket:"

case "$sr_checkout_status" in
  ("success") echo "### ✅ Succesfully checked out student repository\n";;
  ("failure") echo "### ❌ Error checking out student repository" &&
              echo "If you see this message, please contact course staff so we can resolve the issue.\n";;
esac

case "$release_checkout_status" in
  ("success") echo "### ✅ Succesfully checked out release repository\n";;
  ("failure") echo "### ❌ Error checking out release repository" && 
              echo "If you see this message, please contact course staff so we can resolve the issue.\n";;
  ("skipped") echo "### ⬜ Skipped checking out release repository\n";;
esac

case "$local_copy_status" in
  ("success") echo "### ✅ Succesfully copied files from release\n";;
  ("failure") echo "### ❌ Error copying files from release" && 
              echo "If you see this message, please contact course staff so we can resolve the issue.\n";;
  ("skipped") echo "### ⬜ Skipped copying files from release\n";;
esac

case "$verify_policy_status" in
  ("success") echo "### ✅ Succesfully verified student submission\n";;
  ("failure") echo "### ❌ Student submission not successfully verified" && 
              echo "If you see this message, it is likely because you submitted this assignment for grading after the due date." &&
              echo "If you are absolutely sure you have submitted this assignment on time, please contact course staff.\n";;
  ("skipped") echo "### ⬜ Skipped verifying student submission\n";;
esac

case "$autograding_status" in
  ("success") echo "### ✅ Student submission passed autograding! 🎉";;
  ("failure") echo "### ❌ Student submission did not pass autograding";;
  ("skipped") echo "### ⬜ Skipped autograding";;
esac
