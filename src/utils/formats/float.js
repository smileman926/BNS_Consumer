
export default function floatFormat(fl){
	if (typeof(fl) === "number"){
      return fl.toFixed(2);
    }
    else {
      return fl;
    }
}