/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  const kLargetNumIndex = nums.length - k;
//   function partion(l,r) {
      let l = 0,
    r = nums.length - 1;
    while(l<=r) {
        let lt =l;
        let gt = r;
        let i = l;
        const pivotIndex = Math.floor(Math.random()*(r-l-1))+l;
        const pivot = nums[pivotIndex]
        while(i<=gt) {
            if(nums[i]<pivot){
                [nums[i],nums[lt]]=[nums[lt],nums[i]];
                                i++;
                lt++;
            } else if(nums[i]>pivot) {
                [nums[i],nums[gt]]=[nums[gt],nums[i]];
                
                gt--;
            } else {
                i++;
            }
        }
        
        if(gt>=kLargetNumIndex && kLargetNumIndex>=lt){
            return nums[kLargetNumIndex]
        } else if(kLargetNumIndex<lt) {
            r=lt-1
        } else {
            l=gt+1
        }
    }
//   }
//   partion(0,nums.length -1)
//   console.log(nums[kLargetNumIndex])
  return nums[kLargetNumIndex]
};
