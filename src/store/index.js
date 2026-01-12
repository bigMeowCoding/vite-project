/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  const kLargetIndex = nums.length - k;
  let l = 0,
    r = nums.length - 1;
  while (l <= r) {
    const pivotIndex = l + Math.floor(Math.random() * (r - l + 1));
    [nums[pivotIndex], nums[r]] = [nums[r], nums[pivotIndex]];
    const pivot = nums[r];
    let scrollIndex = l;
    for (let i = l; i < r; i++) {
      if (nums[i] < pivot) {
        [nums[i], nums[scrollIndex]] = [nums[scrollIndex], nums[i]];
        scrollIndex++;
      }
    }
    [nums[scrollIndex], nums[r]] = [nums[r], nums[scrollIndex]];
    if (scrollIndex === kLargetIndex) {
      return nums[scrollIndex];
    } else if (scrollIndex < kLargetIndex) {
      l = scrollIndex + 1;
    } else {
      r = scrollIndex - 1;
    }
  }
  return nums[kLargetIndex];
};
