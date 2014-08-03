var util = require('util'),
	VidZapper=require('vz'),
	EventEmitter = require('events').EventEmitter;

var Que=function(args){
	EventEmitter.call(this);
	var self=this;
	var sending=0,vz = new VidZapper(args.vidzapper);

	Que.prototype.plentyQue = function(topic,requests,next) {
		vz.post2('que/plenty',{topic:topic,requests:requests,priority:1},next)
	};

	Que.prototype.registerMachine = function(obj) {
		vz.post2('machine/register',obj,function(d){
			self.emit('register',{who:'machine',entity:d});
		})
	};

	Que.prototype.registerAgent = function(obj) {
		vz.post2('agent/register',obj,function(d){
			self.emit('register',{who:'agent',entity:d});
		})
	};

	Que.prototype.poll = function(topic) {
		var _next=function(topic){self.poll(topic);}
		vz.post2('que/next',{topic:topic},function(d){
			if(!d || d.error ){
				console.log('will try again in 60 seconds');
                setTimeout(_next,1000*60,topic);
                return;
            }else{
				self.emit('found',d);
			}
		})
	};

	Que.prototype.push = function(topic,obj,next){
		vz.post2('que/new',{topic:topic,request:JSON.stringify(obj),priority:1},next);
	};
	Que.prototype.storage=function(id,cb){vz.api2('util/storage',{id:id},cb);}
	Que.prototype.profiles=function(id,cb){vz.get2('util/profile/'+id, cb);}
	Que.prototype.master=function(info,cb){vz.api2('util/master',info, cb);}
	Que.prototype.vze=function(model,cb){vz.api2('util/vze',model,cb);}
}
util.inherits(Que, EventEmitter);
exports = module.exports = function(args) {
  return new Que(args);
};
