function sorter ( arr ) {
	for(let i = 0 ; i < arr.length -1 ; i++ )
		for(let j = 0 ; j < arr.length - i -1 ; j++ ){
			if ( arr[j] > arr[j+1] ) {
				let a = arr[j] ;
				arr[j] = arr[j+1]
				arr[j+1] = a
			}
	}
	return arr;
}


let arr = [1080, 144, 720,360, 480]

console.log(sorter(arr))




