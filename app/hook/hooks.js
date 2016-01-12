var ML = require('mlcloudcode');

//测试hook
ML.Cloud.beforeSave('Ninja', function(obj, res){
    ML.Log.info("beforeSave:" + JSON.stringify(obj));
    res.success();
});

ML.Cloud.afterSave('Ninja', function(obj, res){
    ML.Log.info("afterSave:" + JSON.stringify(obj));
    res.success();
});

ML.Cloud.afterUpdate('Ninja', function(obj, res){
    ML.Log.info("afterUpdate:" + JSON.stringify(obj));
    res.success();
});

ML.Cloud.beforeDelete('Ninja', function(obj, res){
    ML.Log.info("beforeDelete:" + JSON.stringify(obj));
    res.success();
});

ML.Cloud.afterDelete('Ninja', function(obj, res){
    ML.Log.info("afterDelete:" + JSON.stringify(obj));
    res.success();
});
