let go=document.querySelector(".go");
let reset=document.querySelector(".reset");
let pause=document.querySelector(".pause");
let ispaused=false;
let resetIt=false;


document.querySelectorAll('input[type="number"]').forEach(inp=>{
    inp.oninput=()=>{
        if(inp.value.length>inp.maxLength)inp.value=inp.value.slice(0,inp.maxLength);
    }
})


time=[];

go.addEventListener("click",function(){
    s=(document.querySelector("#sec").value);
    m=(document.querySelector("#min").value);
    h=(document.querySelector("#hr").value);
    if(checker([s,m,h])){
        playsound("btn-click",0.45);
        time.push(s);
        time.push(m);
        time.push(h);
        
        let time2=[...time];
        helper(time2);
        
        let tbox=document.querySelectorAll(".timerbox span");
        tbox.forEach((ele,ind)=>{ele.textContent=time2[2-ind]});

        clean();
        
        resetIt=true;
        toggling(this,resetIt);
        
        start();
    }
    else{
        alert("Please insert value as per instruction");
        clean();
    }
})

function start(){
    let y=0; 
    const total=calculatedeg();
    let tbox=document.querySelectorAll(".timerbox span");
    let circle=document.querySelector(".circle");
    
    reset.addEventListener("click",resetfunc);
    pause.addEventListener("click",pauseResFunc);
    let id =setInterval(()=>{
        if(!ispaused){
            if(!resetIt){refresh(tbox); circle.style.background="blue"; clearInterval(id); return;}
            helper(time);
            time[0]--;
            y+=(360/total);
    
            if(time[0]<0){time[1]--; time[0]=59;}
            if(time[1]<0){time[2]--; time[1]=59;}
            circle.style.background=`conic-gradient(red ${y}deg,blue ${y}deg)`;
            if((time[2]<0 || y>=360)){
                playsound("beeper",0);
                time=time.fill("00");
                if(!resetIt){
                    refresh(tbox);
                    circle.style.background="blue";
                    clearInterval(id);
                    return;
                }
            }
            helper(time);
            tbox.forEach((ele,ind)=>{ele.textContent=time[2-ind]});
        }
        
    },1000);
    
}

function helper(arr){
    arr.forEach((e,i,arr) => {
            if(arr[i]=="")arr[i]=("00");
            else arr[i]=("0" + arr[i]).slice(-2);
    },arr);
}

function calculatedeg(){
    let arr=[...time];
    let x=0,total=0;
    for(let i=0;i<3;i++){
        x=parseInt(arr[i]);
        arr.push((isNaN(x) ? 0 : x));
        total+=arr[i]*(60**i);
    }
    return total;
}

function clean(){
    document.querySelector("#sec").value="";
    document.querySelector("#min").value="";
    document.querySelector("#hr").value="";
}

function checker(subject){
    let x=0;
    for(let i=0;i<3;i++){
        x=parseInt(subject[i]);
        subject.push((isNaN(x) ? 0 : x));
    }
    let empty=subject.every(ele=>(ele==0));
    if((subject[0]>59 || subject[1]>59 || subject[2]>23) || empty){return false;}
    return true;
}

function pauseResFunc(){
    playsound("btn-click",0.45);
    if(!ispaused){
        ispaused=true; 
        pause.innerHTML='<img src="images/resume-btn.png" class="controlic" alt="">';
        document.querySelector(".timerbox").classList.add("blink-me")
    }
    else {
        ispaused=false; 
        pause.innerHTML='<img src="images/pause-btn.png" class="controlic" alt="">';
        document.querySelector(".timerbox").classList.remove("blink-me")
    }

}

function resetfunc(){
    playsound("btn-click",0.45);
    resetIt=false;
    toggling(this,resetIt);
    if(ispaused)pauseResFunc();
}

function refresh(tbox){
    tbox.forEach((ele)=>{ele.textContent="00"});
    time=[];
}

function toggling(arg,resetIt){
    arg.style.display="none";
    if(resetIt){
        document.querySelector(".reset").style.display="block";
    }
    else{
        document.querySelector(".go").style.display="block";
    }
}

function playsound(file_name,t){
    var audio = new Audio("sounds/"+file_name+".mp3");
    audio.currentTime=t;
    audio.play();
}

