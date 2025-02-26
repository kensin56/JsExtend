class QueryString {
	constructor(href){
		this.refresh(href);
	}
	refresh(href){
		this.href = href ?? window.location.href.toString();
		this.getKeyVals();
	}
	// get key value array
	getKeyVals(){
		let tmp = this.href.split('?');
		let results = [];

		if(tmp.length > 1){
			// has query string
			let arrQs = tmp[1].split('&');
			for(let qs in arrQs){
				let keyVal = arrQs[qs].split('=');
				results.push({
					key: keyVal[0].toLowerCase(),
					val: keyVal[1]
				});
			}
		}

		this.keyVals = results;
		return results;
	}
	// get keys
	getKeys(){
		let keys = [];
		for(let k in this.keyVals){
			keys.push(this.keyVals[k].key);
		}
		return keys;
	}
	// exists key
	exists(key){
		return (this.keyVals.find(r => r.key == key.toLowerCase()) != undefined);
	}
	// get value
	get(key){
		let nKey = key.toLowerCase();
		let result = null;

		// get value
		if(this.exists(nKey)){
			let qs = this.keyVals.find(r => r.key == nKey);
			if(qs)
				result = qs.val;
		}

		return result;
	}
	// set value
	set(key, val){
		let nKey = key.toLowerCase();
		// set value
		if(!this.exists(nKey)){
			// add
			this.keyVals.push({
				'key': nKey,
				'val': val
			});
		}
		else{
			// update
			let idx = this.keyVals.findIndex(r=>r.key == nKey);
			this.keyVals[idx].val = val;
		}
	}
	remove(key){
		let idx = this.keyVals.map(r=>r.key).indexOf(key.toLowerCase());
		if(idx > -1)
			this.keyVals.splice(idx, 1);
	}
	// generate href
	toString(){
		if(this.keyVals.length > 0){
			let url = this.href.split('?')[0]

			for(let i = 0; i<this.keyVals.length; i++){
				let qs = this.keyVals[i];
				let sep = (i === 0) ? '?' : '&';

				url += sep + qs.key + '=' + qs.val;
			}

			return url;
		}
		else{
			return this.href;
		}
	}
	// toJson
	toJsonString(){
		return JSON.stringify(this.keyVals);
	}
}