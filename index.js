var util = require('util'),
	VidZapper=require('vidzapper'),
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
		var _next=function(){
			self.poll(topic);
		}
		self.vz.post('que/next',{topic:topic},function(d){
			if(!d){
                setTimeout(_next,1000*60);
                return;
            }else{
				self.emit('found',d,_next);
			}
		})
	};
	Que.prototype.push = _push;
	Que.prototype.vz = vz;
	Que.prototype.storage=function(id,cb){vz.api('util/storage',{id:id},cb);}
	Que.prototype.profiles=function(info,cb){vz.api('util/profile',info, cb);}
	Que.prototype.master=function(info,cb){vz.api('util/master',info, cb);}
	Que.prototype.vze=function(model,cb){vz.api('util/vze',model,cb);}
}
util.inherits(Que, EventEmitter);
exports = module.exports = function(args) {
  return new Que(args);
};
