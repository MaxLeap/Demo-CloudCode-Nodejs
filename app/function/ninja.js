var ML = require('mlcloudcode');
ML.serverURL = "http://apidev.leap.as";

var Ninja = ML.Object.extend('Ninja');

ML.Cloud.function("helloNinja", function(req, res){
    // 获取name
    var name = req.body.name;
    var promise = ML.Promise.as();
    var ninja = null;
    var ninja_50 = null;

    // 产生本体
    promise = promise.then(function(){
        ninja = new Ninja();
        ninja.set('name', name);
        return ninja.save().then(function(ninja){
            ML.Log.info("生成本体，ID为："+ninja.id);
        })
    });

    // 产生50个分身
    var clone_ninja_ids = [];
    for(var i = 0; i < 50; i++){
        promise = promise.then(function(){
            var idx = i;
            return function(){
                var clone_ninja = new Ninja();
                clone_ninja.set('name', name + '_' + idx);
                return clone_ninja.save().then(function(clone_ninja){
                    ML.Log.info("多重隐分身："+clone_ninja.id);
                    clone_ninja_ids.push(clone_ninja.id);
                });
            }
        }());
    }

    // 找出第50个分身
    promise = promise.then(function(){
        var query = new ML.Query(Ninja);
        query.equalTo('name',name + '_49');
        return query.first().then(function(result){
            ML.Log.info("找到第50个分身:"+result.id);
            clone_ninja_ids = ML._.without(clone_ninja_ids, result.id);
            ninja_50 = result;
        });
    });

    // 击杀其余49个分身
    promise = promise.then(function(){
        var query = new ML.Query(Ninja);
        query.containedIn('objectId',clone_ninja_ids);
        return query.find().then(function(results){
            var del_promise = ML.Promise.as();
            ML._.each(results, function(result){
                del_promise = del_promise.then(function(){
                    return result.destroy().then(function(){
                        ML.Log.info("击杀分身:"+result.id);
                    });
                });
            });
            del_promise = del_promise.then(function(){
                ML.Log.info("完成分身击杀数目:"+results.length);
            });
            return del_promise;
        });
    });

    // 击杀本体
    promise = promise.then(function(){
        return ninja.destroy().then(function(){
            ML.Log.info("完成本体击杀");
        })
    })

    // 让第50个分身成为新的本体
    promise = promise.then(function(){
        ninja_50.set('name',name + '_new');
        return ninja_50.save().then(function(result){
            ML.Log.info("第50个分身在"+ninja_50.updatedAt.toISOString()+"成为新的本体");
        });
    });

    // 返回新的本体名称
    promise.then(function(){
        res.end(ninja_50.get('name'));
    }).catch(function(err){
        res.end(JSON.stringify(err));
    });

});
