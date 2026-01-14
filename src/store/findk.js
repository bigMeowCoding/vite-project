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
    const pivot = nums[pivotIndex];
    let lt = l;
    let gt = r;
    let i = l;
    while (i <= gt) {
      if (nums[i] < pivot) {
        [nums[i], nums[lt]] = [nums[lt], nums[i]];
        lt++;
        i++;
      } else if (nums[i] > pivot) {
        [nums[i], nums[gt]] = [nums[gt], nums[i]];
        gt--;
      } else {
        i++;
      }
    }

    if (kLargetIndex >= lt && kLargetIndex <= gt) {
      return nums[kLargetIndex];
    } else if (lt > kLargetIndex) {
      r = lt - 1;
    } else {
      l = gt + 1;
    }
  }
  //   return nums[kLargetIndex];
};
