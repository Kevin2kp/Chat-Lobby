const INIT_BUFFER_SIZE = 10;

function Deque(initial_array){

	if(!(this instanceof Deque))
		return new Deque(initial_array);

	function transform_index(i){
		return (((head + i) % buffer.length) + buffer.length) % buffer.length;
	}

	function get(i){

		if(i < 0 || i >= size)
			throw new RangeError('Requested: ' + i + ' Range: ' + 0 + 'to ' + size - 1);

		return buffer[transform_index(i)];
	}

	function set(i, element){

		if(i < 0 || i >= size)
			throw new RangeError('Requested: ' + i + ' Range: ' + 0 + 'to ' + size - 1);

		buffer[transform_index(i)] = element;
	}

	function pop_back(){

		if(size === 0)
			throw new RangeError('Collection is empty');

		let out = buffer[transform_index(size - 1)];
		size--;

		return out;
	}

	function pop_front(){

		if(size === 0)
			throw new RangeError('Collection is empty');

		let out = buffer[transform_index(0)];
		head++;
		size--;

		return out;
	}

	function push(element){

		if(size === buffer.length || buffer.length === 3*size){

			resize();
		}

		buffer[transform_index(size)] = element;
		size++;
	}

	function push_front(element){

		if(size === buffer.length || buffer.length === 3*size){

			resize();
		}

		head = transform_index(-1);
		buffer[head] = element;
		size++;
	}

	function clear(){

		size = 0;
		resize();
	}

	function resize(){

		let new_buffer = new Array(size *2);

		for(let i = 0; i < size; i++){

			new_buffer[i] = get(i);
		}

		head = 0;
		buffer = new_buffer;
	}

	function to_string(){

		if(size <= 0)
			return '';

		let out = '';

		for(let i = 0; i < size - 1; i++){

			out += get(i) + ',';
		}

		return out + get(size - 1);
	}

	function to_array(){

		let out = [];

		for(let i = 0; i < size; i++){

			out.push(get(i));
		}

		return out;

	}


	function get_size(){
		return size;
	}

	//Locals

	let buffer,
		head,
		size;

	//Initialize

	if(initial_array){

		if(initial_array.constructor !== Array)
			return new TypeError('Argument must be an array');

		buffer = initial_array;
		size = initial_array.length;
		head = 0;
		resize();
	}

	else {
		buffer = new Array(INIT_BUFFER_SIZE);
		size = 0;
		head = 0;
	}

	//Interface

	this.get = get;
	this.set = set;
	this.pop_back = pop_back;
	this.pop_front = pop_front;
	this.push = push;
	this.push_front = push_front;
	this.clear = clear;
	this.to_string = to_string;
	this.to_array = to_array;
	this.size = get_size;
}

module.exports = Deque;