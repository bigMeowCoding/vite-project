/**
 * @param {number[]} heights
 * @return {number}
 */
export var trap = function (heights) {
  if (!heights.length) {
    return 0;
  }
  // 1. 遍历数组，找到第一个不是0的数字作为左边界
  // 2. 找到第一个非0数字终止
  // 3.r-l-1>0开始计算
  let l = 0;
  let maxWater = 0;

  for (; l < heights.length - 1; ) {
    console.log("l", l);

    if (!heights[l]) {
      l++;
      continue;
    }
    let r = l + 1;
    // 最多返回 heights.length -1
    // 如果有大于等于heights[l],直接返回这个索引
    // 如果没有，返回最大值索引
    const findMaxRight = () => {
      let max = r;
      for (let i = r; i < heights.length; i++) {
        if (heights[i] >= heights[l]) {
          return i; // 找到大于等于左墙的直接返回，保证能挡水
        }
        if (heights[i] > heights[max]) {
          max = i; // 记录最大高度的索引，防止没有右墙
        }
      }
      return max;
    };
    r = findMaxRight();
    console.log("r", r);
    const blockLen = r - l - 1;
    if (blockLen > 0) {
      let lowerHeight = Math.min(heights[r], heights[l]);
      // 遍历block数组，小于每层高度的块数
      for (let i = lowerHeight; i > 0; i--) {
        console.log("lowerHeight", i);

        for (let j = l + 1; j < r; j++) {
          if (heights[j] < i) {
            console.log("j", heights[j]);

            maxWater++;
          }
        }
      }
    }
    l = r;
  }

  return maxWater;
};
