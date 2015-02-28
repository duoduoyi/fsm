/**********************************************************************************************
 *  * 名称: 有限状态机
 *  * 时间: @2014-11-28@
 *  * 版本: @1.0@
 **/

define(["jquery", "kissy"], function($, S){
    function FSM(config){
        this.config = config;
        this.currentState = this.config.initState;
        this.states = this.config.states;
        this.events = this.config.events;
                                            
        this.defineEvents();
    }

    S.augment(FSM, {
        //事件驱动状态转换(表现层)
        handleEvents:function(event){
            if(!this.currentState)return;
            var actionTransitionFunction = this.states[this.currentState][event.type];
            if(!actionTransitionFunction)return;
            var nextState = actionTransitionFunction.call(this,event);
            this.currentState = nextState;
        },
        //直接触发一个状态转换
        doTransition:function(state,type,event){
            var actionTransitionFunction = this.states[state][type];
            if(!actionTransitionFunction)return;
            var nextState = actionTransitionFunction.call(this,event);
            this.currentState = nextState;
        },
        //定义事件 (行为层)
        defineEvents:function(){
            var _this = this,
            events = this.events;
            S.each(events,function(fn,k){
                fn.call(_this,function(arg){
                    $(_this).trigger(k,arg);
                });
                $(_this).on(k,_this.handleEvents);
            });
        }
    });

    return FSM;
});
