/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    if(!nums.length) {
        return 0
    }
    let set = new Set(nums);
    let maxLen=0;
    for(let num of set) {
        if(!set.has(num -1)) {
            let count =1;
            let numsItem =num+1
            while(set.has(numsItem)) {
                count++
                numsItem=numsItem+1;
            }
            maxLen=Math.max(count,maxLen);
        }
    }
    return maxLen;
};
