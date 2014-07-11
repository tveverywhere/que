var util = require('util'),
	VidZapper=require('vz'),
	EventEmitter = require('events').EventEmitter;

var Que=function(args){
	EventEmitter.call(this);
	var self=this;
	var sending=0,vz = new VidZapper(args.vidzapper);
	var _push=function(topic,obj,next){
		self.vz.post('que/new',{topic:topic,request:JSON.stringify(obj),priority:1},next);
	}
	Que.prototype.plentyQue = function(topic,requests,next) {
		self.vz.post('que/plenty',{topic:topic,requests:requests,priority:1},next)
	};

	Que.prototype.poll = function(topic) {
		var _next=function(topic){self.poll(topic);}
		self.vz.post('que/next',{topic:topic},function(d){
			if(!d || d.error ){
				console.log('will try again in 60 seconds');
                setTimeout(_next,1000*60,topic);
                return;
            }else{
				self.emit('found',d);
			}
		})
	};
	Que.prototype.push = _push;
	Que.prototype.vz = vz;
	Que.prototype.storage=function(id,cb){vz.api('util/storage',{id:id},cb);}
	Que.prototype.profiles=function(id,cb){vz.get2('util/profile/'+id, cb);}
	Que.prototype.master=function(info,cb){vz.api('util/master',info, cb);}
	Que.prototype.vze=function(model,cb){vz.api('util/vze',model,cb);}
}
util.inherits(Que, EventEmitter);
exports = module.exports = function(args) {
  return new Que(args);
};
