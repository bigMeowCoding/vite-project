

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
export var threeSum = function (nums) {
    const result = [];
    const len = nums.length;
    if (len < 3) return result;

    nums.sort((a, b) => a - b);

    for (let i = 0; i < len - 2; i++) {
        if (nums[i] > 0) break; // 如果当前数字大于 0，则三数之和一定大于 0
        if (i > 0 && nums[i] === nums[i - 1]) continue; // 去重

        let left = i + 1;
        let right = len - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++; // 去重
                while (left < right && nums[right] === nums[right - 1]) right--; // 去重
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
};
