/**
 * Created by Robin on 06/01/2018.
 */

module.exports = {

    getObjects: function(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] === 'object') {
                objects = objects.concat(module.exports.getObjects(obj[i], key, val));
            } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i === key && obj[i] === val || i === key && val === '') { //
                objects.push(obj);
            } else if (obj[i] === val && key === ''){
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) === -1){
                    objects.push(obj);
                }
            }
        }
        return objects;
    },
    getValues : function(obj, key) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] === 'object') {
                objects = objects.concat(module.exports.getValues(obj[i], key));
            } else if (i === key) {
                objects.push(obj[i]);
            }
        }
        return objects;
    },
    getKeys : function(obj, val){
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] === 'object') {
                objects = objects.concat(module.exports.getKeys(obj[i], val));
            } else if (obj[i] === val) {
                objects.push(i);
            }
        }
        return objects;
    }
};

