var util = require('util'),
	VidZapper=require('vidzapper'),
	EventEmitter = require('events').EventEmitter;

var Que=function(args){
	EventEmitter.call(this);
	var self=this;
	var sending=0;
	var _push=function(topic,obj,next){
		self.vz.post('que/new',{topic:topic,request:JSON.stringify(obj),priority:1},next);
	}
	Que.prototype.plentyQue = function(topic,requests,next) {
		self.vz.post('que/plenty',{topic:topic,requests:requests,priority:1},next)
	};
	Que.prototype.poll = function(topic) {
		self.vz.post('que/next',{topic:topic},function(d){
			self.emit('found',d);
		})
	};
	Que.prototype.push = _push;
	Que.prototype.vz = new VidZapper(args.vidzapper);
}
util.inherits(Que, EventEmitter);
exports = module.exports = function(args) {
  return new Que(args);
};
