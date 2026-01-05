/**
 * @param {number[]} heights
 * @return {number}
 */
export var trapDP = function (heights) {
  const n = heights.length;
  if (n === 0) return 0;

  const leftMax = new Array(n).fill(0);
  const rightMax = new Array(n).fill(0);

  // 1. 从左向右遍历，记录每个位置左边的最大高度
  leftMax[0] = heights[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
  }

  // 2. 从右向左遍历，记录每个位置右边的最大高度
  rightMax[n - 1] = heights[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
  }

  // 3. 再次遍历，累加每个位置的积水量
  let maxWater = 0;
  for (let i = 0; i < n; i++) {
    // 短板效应：取决于左右两边最大高度较小的那一个
    maxWater += Math.min(leftMax[i], rightMax[i]) - heights[i];
  }

  return maxWater;
};
