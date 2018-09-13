const Deque = require('./Deque');

//Test append

let test_count = 10;
let deque = Deque();
let arr = [];

for(let i = 0; i < test_count; i++){

	arr.push(i);
	deque.push(i);
}

let pass = true;
pass = arr.toString().trim() === deque.to_string().trim();


console.log('Testing append \n');
console.log(arr.toString().trim());
console.log(deque.to_string().trim());
console.log('Pass: ' + pass + '\n');


//Test prepend

for(let i = 1; i < test_count - 1; i++){

	arr.unshift(-i);
	deque.push_front(-i);
}

pass = arr.toString().trim() === deque.to_string().trim();

console.log('Testing prepend \n');
console.log(arr.toString().trim());
console.log(deque.to_string().trim());
console.log('Pass: ' + pass + '\n');


//Test set(random)

for(let i = 1; i < test_count; i++){

	let j = Math.floor(Math.abs(Math.random()*arr.length));

	arr[j] = 'r' + i;
	deque.set(j, 'r' + i);
}

pass = arr.toString().trim() === deque.to_string().trim();

console.log('Testing set \n');
console.log(arr.toString().trim());
console.log(deque.to_string().trim());
console.log('Pass: ' + pass + '\n');


arr = [];
deque.clear();

pass = arr.toString().trim() === deque.to_string().trim();

console.log('Testing set \n');
console.log(arr.toString().trim());
console.log(deque.to_string().trim());
console.log('Pass: ' + pass + '\n');



