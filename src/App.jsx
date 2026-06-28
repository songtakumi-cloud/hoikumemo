import { useState, useEffect, useRef } from "react";

// ─── 定数 ────────────────────────────────────────────
const SAMPLE_TEXTS = {
  "①日回り組": "今日の日回り組です。朝は全体的に元気だったんですが、ゆうとくんは、いつものゆうちゃんなんですが、最初少しお母さんと離れる時に寂しそうでした。でも、外遊びが始まるとだいぶ切り替わっていました。あと、さくらちゃんとりんちゃんが砂場でお店屋さんごっこをしていて、最初は二人でやってたんですが、途中でそうたくんも入ってきました。そうたくん自分から僕がお店の人のやるって言えてて、そのあともちゃんと順番待ててました。あとたけるくん、みんなからたけちゃんって呼ばれてるんですが、給食の時間に少し苦手な野菜があって、最初はいらなーいって言ってたんですけど、隣のゆうちゃんが一緒に食べようって言ってくれて、一口だけ挑戦してました。それとりんちゃんなんですけども、今日はお片付けの時に自分から周りの子にこっちまだあるよって声かけていて、すごく周りを見て行動できていた印象でした。",
  "②ひまわり組": "今日のひまわり組です。朝みおちゃんがちょっと眠そうで、最初はあんまりお話してなかったんですけど、制作が始まったらだんだん集中して取り組めてました。あとけんたくん。みんなけんちゃんと呼ぶんですけど、今日は折り紙で飛行機を作ってまして。作ってて先生見て飛ぶかなって何回も試してました。途中ではるとくんも来て、2人でどっちが遠くまで飛ぶかやってたんですけど、はるとくんが負けて少し悔しそうでした。あとみおちゃんが私もやりたいって自分から入っていって、普段より積極的に関わろうとしてる感じがありました。あと給食では、けんちゃんが牛乳こぼしちゃったんですけど、自分でティッシュ持ってきて片付けようとしてました。あとはそうたくんなんですけど、今日は朝からすごく元気で、外遊びの時に鬼ごっこをずっとしてました。あとあやちゃんとひなのちゃんが一緒にお絵かきをしてて、最初は別々に描いてたんですけど、途中から一緒にお家描こうって話してました。あやちゃんが色を探して少し困ってたら、ひなちゃんがこれ使っていいよって貸してました。そうちゃんは鬼ごっこしてる途中で転んじゃって少し泣いてたんですけど、そのあとで気持ち切り替えてまた遊びに戻れてました。帰る前、ひなちゃんが自分から椅子を並べるのを手伝ってました。",
  "③桜組": "今日桜組です。朝の自由遊びでは、なおくん。なおくんじゃなくて、みんななおちゃんって呼ぶこともあるんですけど、ブロック遊びをしていました。途中、ゆいちゃんとしょうくんも来て、3人で大きいお家みたいなのを作っていました。しょうくんがここ駐車場にするって言っていたんですけど、なおちゃんがそこは玄関がいいって言ってて、少し意見がぶつかってしまいました。でも、そのあとゆいちゃんがじゃあこっちも駐車場にしようって提案してて、3人とも納得してまた遊び始めていました。あと、しょうくんなんですけど、給食の時間にいつもより早く食べ終わったあと、近くのコに頑張ってって声をかけたのが印象的でした。"
};

const INITIAL_ROSTER = {
  "日回り組": [
    {name:"ゆうと",nicknames:"ゆうちゃん"},{name:"さくら",nicknames:"さくらちゃん"},
    {name:"りん",nicknames:"りんちゃん"},{name:"そうた",nicknames:"そうたくん"},{name:"たける",nicknames:"たけちゃん"}
  ],
  "ひまわり組": [
    {name:"みお",nicknames:"みおちゃん"},{name:"けんた",nicknames:"けんちゃん,けんたくん"},
    {name:"はると",nicknames:"はるとくん"},{name:"そうた",nicknames:"そうちゃん,そうたくん"},
    {name:"あや",nicknames:"あやちゃん"},{name:"ひなの",nicknames:"ひなちゃん,ひなのちゃん"}
  ],
  "桜組": [
    {name:"なお",nicknames:"なおちゃん,なおくん"},{name:"ゆい",nicknames:"ゆいちゃん"},{name:"しょう",nicknames:"しょうくん"}
  ]
};

const TEMPLATE_PROMPTS = [
  {icon:"🏫",label:"クラス宣言",   text:"今日の〇〇組です。"},
  {icon:"⭐",label:"気になった子", text:"気になった子は"},
  {icon:"🌱",label:"成長したこと", text:"成長したと感じたのは"},
  {icon:"🤝",label:"友達との関わり",text:"友達との関わりで印象的だったのは"},
  {icon:"🍽️",label:"給食・生活",  text:"給食や生活面では"},
  {icon:"⚠️",label:"気になる点",  text:"気になる点として"},
  {icon:"💡",label:"来週意識したいこと",text:"来週意識したいのは"},
];

const YOUROKU_FIELDS = [
  {key:"心身の健康",     label:"心身の健康・生活習慣",   icon:"💪"},
  {key:"人との関わり",   label:"人との関わり・社会性",   icon:"🤝"},
  {key:"遊びへの取り組み",label:"遊び・学びへの取り組み",icon:"🎨"},
  {key:"言葉と表現",     label:"言葉・表現",             icon:"💬"}
];
const MENDAN_FIELDS = [
  {key:"最近の様子",  label:"最近の様子",      icon:"👀"},
  {key:"得意なこと",  label:"得意なこと・強み", icon:"⭐"},
  {key:"成長した点",  label:"成長した点",      icon:"🌱"},
  {key:"友達関係",    label:"お友達との関わり", icon:"🤝"},
  {key:"気になる点",  label:"気になる点",      icon:"⚠️"},
  {key:"今後の関わり",label:"今後の関わり方",  icon:"💡"},
];

// デザイントークン
const T = {
  green:  "#3a7d44",
  greenL: "#6abf7a",
  greenBg:"#f0f8f1",
  peach:  "#ff8c69",
  sky:    "#64b5f6",
  lavend: "#9c8fe6",
  warn:   "#ff9800",
  red:    "#e53935",
  bg:     "#faf9f7",
  card:   "#ffffff",
  border: "#e8e4de",
  text:   "#2d2d2d",
  sub:    "#888",
};

const CHILD_COLORS = ["#6abf7a","#ff8c69","#64b5f6","#f06292","#9c8fe6","#4db6ac","#ffb74d"];
function childColor(n){let h=0;for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%CHILD_COLORS.length;return CHILD_COLORS[h];}
function todayStr(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}

// ─── プロンプト ───────────────────────────────────────
function buildAnalyzePrompt(text,roster,gp,cp){
  const rt=Object.entries(roster).map(([cls,ch])=>cls+": "+ch.map(c=>c.name+"("+c.nicknames+")").join(", ")).join("\n");
  const pol=(gp.philosophy||cp.classGoal)?`\n【園方針】${gp.philosophy||""}${cp.classGoal?" / クラス目標: "+cp.classGoal:""}\n`:"";
  return `あなたは保育記録整理システムです。園児名簿の通称を正式名に名寄せし、発話記録から各園児のエピソードを抽出してください。${pol}
【園児名簿】\n${rt}\n【発話記録】\n${text}
以下のJSON形式のみで出力。説明文・コードブロック禁止。
{"クラス":"クラス名","園児記録":{"正式名":["エピソード1","エピソード2"]}}
ルール:登場しない園児は含めない/先生の評価・印象も含める/JSONのみ返す`;
}
function buildDocPrompt(mode,childName,entries,gp){
  const all=entries.map(e=>`【${e.date} ${e.className}】\n`+e.episodes.join("\n")).join("\n\n");
  const hasPol=!!(gp.philosophy||gp.values||gp.goals);
  const pol=hasPol?`\n【園の教育理念・方針】\n${[gp.philosophy,gp.values,gp.goals].filter(Boolean).join(" / ")}\n`:"";
  const polNote=hasPol?`\n末尾に必ず1行追記:「※ ${gp.name||"園"}の教育理念（${(gp.philosophy||"").slice(0,20)}）を踏まえて生成しています。」`:"";
  if(mode==="youroku"){
    return `あなたは幼稚園・保育園の書類作成支援システムです。${pol}
以下は「${childName}」の保育記録です。要録に使える文章を作成してください。
【保育記録】\n${all}
各項目2〜4文、丁寧・客観的な文体で。${polNote}
JSONのみ返してください。{"心身の健康":"","人との関わり":"","遊びへの取り組み":"","言葉と表現":"","_policy_note":""}`;
  }
  return `あなたは幼稚園・保育園の書類作成支援システムです。${pol}
以下は「${childName}」の保育記録です。保護者面談資料を作成してください。
【保育記録】\n${all}
各項目1〜3文、保護者に伝わる温かみのある文体で。${polNote}
JSONのみ返してください。{"最近の様子":"","得意なこと":"","成長した点":"","友達関係":"","気になる点":"","今後の関わり":"","_policy_note":""}`;
}
function buildRevisePrompt(childName,draft,instruction,mode){
  const f=mode==="youroku"?'{"心身の健康":"","人との関わり":"","遊びへの取り組み":"","言葉と表現":"","_policy_note":""}':'{"最近の様子":"","得意なこと":"","成長した点":"","友達関係":"","気になる点":"","今後の関わり":"","_policy_note":""}';
  return `「${childName}」の書類ドラフトを以下の指示で修正してください。\n【現在のドラフト】\n${JSON.stringify(draft,null,2)}\n【修正指示】\n${instruction}\nJSONのみ: ${f}`;
}
function buildTimelinePrompt(childName,entries){
  const all=entries.map(e=>`【${e.date} ${e.className}】\n`+e.episodes.join("\n")).join("\n\n");
  return `以下は「${childName}」の保育記録です。月ごとの成長変化を時系列でまとめてください。\n【保育記録】\n${all}\n各月の成長・変化を1〜2文で。JSONのみ返してください。\n{"timeline":[{"month":"YYYY年MM月","summary":"成長の要約"}]}`;
}
function buildChatPrompt(childName,records,question,history,gp){
  const entries=records[childName]||[];
  const all=entries.length>0?entries.map(e=>`【${e.date} ${e.className}】\n`+e.episodes.join("\n")).join("\n\n"):"（記録なし）";
  const pol=gp.philosophy?`\n【園の教育理念】${gp.philosophy}\n`:"";
  const hist=history.length>0?"\n【これまでの会話】\n"+history.map(h=>`${h.role==="user"?"先生":"AI"}: ${h.content}`).join("\n")+"\n":"";
  return `あなたは保育専門のAIアドバイザーです。${pol}\n以下は「${childName}」の蓄積された保育記録です。この記録を根拠に先生の質問に答えてください。\n【${childName}の保育記録】\n${all}${hist}\n【先生の質問】\n${question}\n回答ルール:記録から具体的な日付・エピソードを引用して根拠を示す/記録にない情報は推測だと明示/温かいトーンで200文字以内`;
}

// ─── API ─────────────────────────────────────────────
async function callClaude(prompt){
  let res;
  try{res=await fetch("/api/claude",{method:"POST",headers:{"content-type":"application/json","anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,messages:[{role:"user",content:prompt}]})});}
  catch(e){throw new Error("fetch失敗: "+e.message);}
  let data;
  try{data=await res.json();}catch(e){const t=await res.text().catch(()=>"");throw new Error(`HTTP ${res.status} / ${t.slice(0,100)}`);}
  if(data.error) throw new Error(`APIエラー: ${data.error.message}`);
  const raw=(data.content||[]).find(b=>b.type==="text")?.text||"";
  if(!raw) throw new Error("空のレスポンス");
  return raw;
}
async function callClaudeJSON(prompt){
  const raw=await callClaude(prompt);
  const match=raw.match(/\{[\s\S]*\}/);
  if(!match) throw new Error("JSON見つからず: "+raw.slice(0,80));
  return JSON.parse(match[0]);
}
async function whisper(blob){
  const fd=new FormData();
  const ext=blob.type.includes("mp4")||blob.type.includes("m4a")?"m4a":"webm";
  fd.append("file",blob,`rec.${ext}`);fd.append("model","whisper-1");fd.append("language","ja");
  const data=await fetch("/api/whisper",{method:"POST",body:fd}).then(r=>r.json());
  if(data.error) throw new Error("Whisper: "+data.error.message);
  return data.text||"";
}

// ─── ストレージ ───────────────────────────────────────
const SK={rec:"hm-rec-v5",doc:"hm-doc-v2",gp:"hm-gp",cp:"hm-cp",tl:"hm-tl",offlineQ:"hm-offline-q",roster:"hm-roster"};
async function ld(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}}
async function sv(k,d){try{localStorage.setItem(k,JSON.stringify(d));return true;}catch{return false;}}

// ─── メインコンポーネント ─────────────────────────────
export default function App(){
  const [roster,setRoster]   = useState(INITIAL_ROSTER);
  const [inputText,setInput] = useState("");
  const [result,setResult]   = useState(null);
  const [loading,setLoad]    = useState(false);
  const [errMsg,setErr]      = useState("");
  const [tab,setTab]         = useState("input");
  const [sample,setSample]   = useState("");
  const [records,setRec]     = useState({});
  const [selChild,setSelC]   = useState(null);
  const [ready,setReady]     = useState(false);
  const [saveStatus,setSS]   = useState("");

  // 設定モーダル
  const [showSettings,setShowSettings] = useState(false);
  const [settingsTab,setSettingsTab]   = useState("roster");

  // 録音
  const [recSt,setRecSt]   = useState("idle");
  const [recSec,setRecSec] = useState(0);
  const [recErr,setRecErr] = useState("");
  const mrRef              = useRef(null);
  const chunksRef          = useRef([]);
  const timerRef           = useRef(null);
  const [showTpl,setShowTpl] = useState(false);

  // オフラインキュー
  const [offlineQ,setOfflineQ]       = useState([]);
  const [processingQ,setProcessingQ] = useState(false);

  // エピソード編集・移動
  const [editEp,setEditEp]         = useState(null);
  const [editEpText,setEditEpText] = useState("");
  const [moveEp,setMoveEp]         = useState(null);

  // 書類生成
  const [docMode,setDocMode]   = useState("youroku");
  const [docChild,setDocChild] = useState(null);
  const [docDraft,setDocDraft] = useState(null);
  const [docSaved,setDocSaved] = useState({});
  const [docLoad,setDocLoad]   = useState(false);
  const [docErr,setDocErr]     = useState("");
  const [editF,setEditF]       = useState(null);
  const [editT,setEditT]       = useState("");
  const [aiInstr,setAiInstr]   = useState("");
  const [aiTgt,setAiTgt]       = useState(null);
  const [showAI,setShowAI]     = useState(false);
  const [revising,setRevising] = useState(false);

  // タイムライン
  const [tlChild,setTlChild] = useState(null);
  const [tlData,setTlData]   = useState({});
  const [tlLoad,setTlLoad]   = useState(false);
  const [tlErr,setTlErr]     = useState("");

  // Chat
  const [chatChild,setChatChild]  = useState(null);
  const [chatHistory,setChatHist] = useState([]);
  const [chatInput,setChatInput]  = useState("");
  const [chatLoad,setChatLoad]    = useState(false);
  const chatEndRef                = useRef(null);

  // 園設定
  const [gp,setGp] = useState({name:"",philosophy:"",concept:"",values:"",policy:"",goals:""});
  const [cp,setCp] = useState({classGoal:"",monthTheme:"",awareness:""});
  const [polSaved,setPolSaved] = useState(false);

  useEffect(()=>{
    Promise.all([ld(SK.rec),ld(SK.doc),ld(SK.gp),ld(SK.cp),ld(SK.tl),ld(SK.offlineQ),ld(SK.roster)])
      .then(([r,d,g,c,t,oq,rs])=>{
        setRec(r||{});setDocSaved(d||{});
        if(g) setGp(g);if(c) setCp(c);setTlData(t||{});
        setOfflineQ(oq||[]);if(rs) setRoster(rs);
        setReady(true);
      });
  },[]);
  useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current);},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatHistory]);

  // ─── 録音 ────────────────────────────────────────────
  const startRec=async()=>{
    setRecErr("");setRecSec(0);chunksRef.current=[];
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:false});
      const mime=MediaRecorder.isTypeSupported("audio/webm")?"audio/webm":"audio/mp4";
      const mr=new MediaRecorder(stream,{mimeType:mime});
      mrRef.current=mr;
      mr.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data);};
      mr.onstop=async()=>{
        stream.getTracks().forEach(t=>t.stop());
        const blob=new Blob(chunksRef.current,{type:mime});
        if(navigator.onLine){
          try{const t=await whisper(blob);setInput(p=>p?p+"\n\n"+t:t);setRecSt("done");setTimeout(()=>setRecSt("idle"),2500);}
          catch(e){setRecErr(e.message);setRecSt("idle");}
        }else{
          const reader=new FileReader();
          reader.onload=async()=>{
            const entry={id:Date.now(),b64:reader.result,mimeType:mime,timestamp:todayStr(),label:`録音 ${new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"})}`};
            const newQ=[...offlineQ,entry];setOfflineQ(newQ);await sv(SK.offlineQ,newQ);
            setRecSt("idle");setRecErr("📥 オフライン保存しました");
          };reader.readAsDataURL(blob);
        }
      };
      mr.start(100);setRecSt("recording");
      timerRef.current=setInterval(()=>setRecSec(s=>{if(s>=120){stopRec();return s;}return s+1;}),1000);
    }catch(e){setRecErr("マイクアクセス拒否: "+e.message);}
  };
  const stopRec=()=>{
    if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
    if(mrRef.current&&mrRef.current.state!=="inactive"){mrRef.current.stop();setRecSt("transcribing");}
  };
  const processOfflineQueue=async()=>{
    if(!navigator.onLine){setRecErr("オフラインです");return;}
    setProcessingQ(true);
    const results=[];
    for(const item of offlineQ){
      try{const res=await fetch(item.b64);const blob=await res.blob();const text=await whisper(blob);results.push({...item,text});}
      catch(e){results.push({...item,error:e.message});}
    }
    const texts=results.filter(r=>r.text).map(r=>`【${r.label}】\n${r.text}`).join("\n\n");
    if(texts) setInput(p=>p?p+"\n\n"+texts:texts);
    const failed=results.filter(r=>r.error);
    setOfflineQ(failed);await sv(SK.offlineQ,failed);
    setProcessingQ(false);
  };

  // ─── 振り分け ─────────────────────────────────────────
  const handleAnalyze=async()=>{
    if(!inputText.trim()) return;
    setLoad(true);setErr("");setResult(null);
    try{
      const parsed=await callClaudeJSON(buildAnalyzePrompt(inputText,roster,gp,cp));
      if(!parsed["園児記録"]) throw new Error("園児記録なし");
      setResult(parsed);
      // ★ 解析完了後に自動で振り分けタブへ遷移
      setTab("result");
    }catch(e){setErr(e.message);}finally{setLoad(false);}
  };
  const handleSave=async()=>{
    if(!result) return;
    const ds=todayStr(),cn=result["クラス"]||"";
    const upd={...records};
    Object.entries(result["園児記録"]||{}).forEach(([name,eps])=>{
      if(!upd[name]) upd[name]=[];
      if(!upd[name].some(r=>r.date===ds&&r.className===cn))
        upd[name]=[{date:ds,className:cn,episodes:Array.isArray(eps)?eps:[eps]},...upd[name]];
    });
    setRec(upd);const ok=await sv(SK.rec,upd);
    setSS(ok?"saved":"error");setTimeout(()=>setSS(""),2500);
  };
  const delChild=async(name)=>{
    if(!window.confirm(name+"の記録を全て削除しますか？")) return;
    const u={...records};delete u[name];setRec(u);await sv(SK.rec,u);
    if(selChild===name) setSelC(null);
  };

  // ─── エピソード編集・移動 ─────────────────────────────
  const startEditEp=(childName,epIndex,text)=>{setEditEp({childName,epIndex});setEditEpText(text);setMoveEp(null);};
  const saveEditEp=()=>{
    if(!editEp) return;
    const nr={...result,["園児記録"]:{...result["園児記録"]}};
    nr["園児記録"][editEp.childName]=[...nr["園児記録"][editEp.childName]];
    nr["園児記録"][editEp.childName][editEp.epIndex]=editEpText;
    setResult(nr);setEditEp(null);
  };
  const deleteEp=(childName,epIndex)=>{
    const nr={...result,["園児記録"]:{...result["園児記録"]}};
    nr["園児記録"][childName]=nr["園児記録"][childName].filter((_,i)=>i!==epIndex);
    if(nr["園児記録"][childName].length===0) delete nr["園児記録"][childName];
    setResult(nr);setEditEp(null);setMoveEp(null);
  };
  const startMoveEp=(childName,epIndex,text)=>{setMoveEp({childName,epIndex,text});setEditEp(null);};
  const executeMoveEp=(toChild)=>{
    if(!moveEp||moveEp.childName===toChild) return;
    const nr={...result,["園児記録"]:{...result["園児記録"]}};
    nr["園児記録"][moveEp.childName]=nr["園児記録"][moveEp.childName].filter((_,i)=>i!==moveEp.epIndex);
    if(nr["園児記録"][moveEp.childName].length===0) delete nr["園児記録"][moveEp.childName];
    if(!nr["園児記録"][toChild]) nr["園児記録"][toChild]=[];
    nr["園児記録"][toChild]=[...nr["園児記録"][toChild],moveEp.text];
    setResult(nr);setMoveEp(null);
  };

  // ─── 書類生成 ─────────────────────────────────────────
  const currentFields=docMode==="youroku"?YOUROKU_FIELDS:MENDAN_FIELDS;
  const handleGenDoc=async(childName)=>{
    const entries=records[childName];
    if(!entries?.length){setDocErr("記録がありません");return;}
    setDocLoad(true);setDocErr("");setDocDraft(null);setEditF(null);setShowAI(false);
    try{
      const parsed=await callClaudeJSON(buildDocPrompt(docMode,childName,entries,gp));
      setDocDraft(parsed);
      const key=childName+"_"+docMode;
      const upd={...docSaved,[key]:parsed};setDocSaved(upd);await sv(SK.doc,upd);
    }catch(e){setDocErr(e.message);}finally{setDocLoad(false);}
  };
  const handleDirectSave=async()=>{
    if(!editF||!docDraft) return;
    const upd={...docDraft,[editF]:editT};setDocDraft(upd);setEditF(null);
    const key=docChild+"_"+docMode;
    const s={...docSaved,[key]:upd};setDocSaved(s);await sv(SK.doc,s);
  };
  const handleAiRevise=async()=>{
    if(!aiInstr.trim()||!docDraft) return;
    setRevising(true);
    try{
      let instr=aiInstr;
      if(aiTgt){const fl=currentFields.find(f=>f.key===aiTgt)?.label||aiTgt;instr=`「${fl}」について：${aiInstr}`;}
      const parsed=await callClaudeJSON(buildRevisePrompt(docChild,docDraft,instr,docMode));
      setDocDraft(parsed);
      const key=docChild+"_"+docMode;
      const s={...docSaved,[key]:parsed};setDocSaved(s);await sv(SK.doc,s);
      setAiInstr("");setShowAI(false);
    }catch(e){setDocErr("AI修正失敗: "+e.message);}finally{setRevising(false);}
  };
  const switchMode=(mode)=>{setDocMode(mode);setEditF(null);setShowAI(false);setDocErr("");if(docChild){const key=docChild+"_"+mode;setDocDraft(docSaved[key]||null);}};
  const selectDocChild=(name)=>{setDocChild(name);setEditF(null);setShowAI(false);setDocErr("");const key=name+"_"+docMode;setDocDraft(docSaved[key]||null);};

  // ─── タイムライン ─────────────────────────────────────
  const handleGenTl=async(name)=>{
    const entries=records[name];
    if(!entries?.length){setTlErr("記録がありません");return;}
    setTlLoad(true);setTlErr("");
    try{
      const parsed=await callClaudeJSON(buildTimelinePrompt(name,entries));
      const upd={...tlData,[name]:parsed.timeline||[]};setTlData(upd);await sv(SK.tl,upd);
    }catch(e){setTlErr(e.message);}finally{setTlLoad(false);}
  };

  // ─── Chat ─────────────────────────────────────────────
  const handleChat=async()=>{
    if(!chatInput.trim()||!chatChild) return;
    const userMsg={role:"user",content:chatInput};
    const newHist=[...chatHistory,userMsg];
    setChatHist(newHist);setChatInput("");setChatLoad(true);
    try{const raw=await callClaude(buildChatPrompt(chatChild,records,chatInput,chatHistory,gp));setChatHist([...newHist,{role:"assistant",content:raw}]);}
    catch(e){setChatHist([...newHist,{role:"assistant",content:"⚠️ "+e.message}]);}
    finally{setChatLoad(false);}
  };

  // ─── 設定保存 ─────────────────────────────────────────
  const savePolicy=async()=>{await Promise.all([sv(SK.gp,gp),sv(SK.cp,cp)]);setPolSaved(true);setTimeout(()=>setPolSaved(false),2000);};
  const saveRoster=async()=>{await sv(SK.roster,roster);setPolSaved(true);setTimeout(()=>setPolSaved(false),2000);};
  const exportCSV=()=>{
    const rows=["クラス,正式名,通称"];
    Object.entries(roster).forEach(([cls,ch])=>ch.forEach(c=>rows.push(`"${cls}","${c.name}","${c.nicknames}"`)));
    const blob=new Blob(["\uFEFF"+rows.join("\n")],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="roster.csv";a.click();URL.revokeObjectURL(url);
  };
  const importCSV=(e)=>{
    const file=e.target.files?.[0];if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const lines=ev.target.result.replace(/^\uFEFF/,"").split("\n").slice(1);
      const nr={};
      lines.forEach(line=>{if(!line.trim()) return;const parts=line.split(",").map(s=>s.replace(/^"|"$/g,"").trim());if(parts.length<2) return;const[cls,name,nicknames=""]=parts;if(!nr[cls]) nr[cls]=[];nr[cls].push({name,nicknames});});
      if(Object.keys(nr).length>0){setRoster(nr);sv(SK.roster,nr);alert("インポート完了（"+Object.values(nr).flat().length+"名）");}
      else alert("インポート失敗。形式を確認してください。");
    };reader.readAsText(file,"UTF-8");e.target.value="";
  };

  const allChildren=Object.keys(records).sort();
  const total=Object.values(records).reduce((s,a)=>s+a.length,0);

  // ─── スタイル ─────────────────────────────────────────
  const css={
    page:  {fontFamily:"'Hiragino Kaku Gothic Pro','Noto Sans JP',sans-serif",background:T.bg,minHeight:"100vh"},
    hdr:   {background:`linear-gradient(135deg, ${T.green} 0%, #2d6a3f 100%)`,padding:"0 16px",height:56,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(58,125,68,0.3)"},
    wrap:  {maxWidth:640,margin:"0 auto",padding:"14px 12px 90px"},
    card:  {background:T.card,borderRadius:16,padding:"14px 16px",marginBottom:12,border:"1px solid "+T.border,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"},
    // ボトムナビ
    nav:   {position:"fixed",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(10px)",borderTop:"1px solid "+T.border,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"},
    navBtn:(a)=>({flex:1,padding:"8px 2px 6px",border:"none",background:"transparent",color:a?T.green:"#bbb",fontSize:9,fontWeight:a?700:400,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,transition:"all 0.15s"}),
    // モーダル
    overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,display:"flex",alignItems:"flex-end"},
    modal: {background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxHeight:"88vh",overflowY:"auto",paddingBottom:32},
    // 共通ボタン
    btn:   (d,c)=>({padding:"11px 20px",borderRadius:12,border:"none",background:d?"#e0e0e0":c||T.green,color:d?"#aaa":"#fff",fontWeight:700,fontSize:13,cursor:d?"not-allowed":"pointer",transition:"opacity 0.15s"}),
    bsm:   (c)=>({padding:"7px 14px",borderRadius:10,border:"none",background:c||T.green,color:"#fff",fontWeight:600,fontSize:12,cursor:"pointer",minHeight:36,display:"inline-flex",alignItems:"center",justifyContent:"center"}),
    bout:  {padding:"7px 13px",borderRadius:10,border:"1.5px solid "+T.border,background:"#fff",color:T.sub,fontSize:12,cursor:"pointer",minHeight:36,display:"inline-flex",alignItems:"center",justifyContent:"center"},
    lbl:   {fontSize:11,color:T.sub,fontWeight:600,marginBottom:6,letterSpacing:"0.03em"},
    ta:    {width:"100%",padding:11,borderRadius:12,border:"1.5px solid "+T.border,fontSize:13,lineHeight:1.7,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none",background:"#fafaf8",transition:"border 0.15s"},
    inp:   {width:"100%",padding:"9px 11px",borderRadius:10,border:"1.5px solid "+T.border,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"},
    av:    (c,sz)=>({width:sz,height:sz,borderRadius:"50%",background:c,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:sz*0.42,color:"#fff",fontWeight:700,flexShrink:0,boxShadow:"0 2px 6px "+c+"55"}),
    tag:   (bg)=>({fontSize:10,background:bg||T.greenBg,color:bg?"#fff":T.green,padding:"2px 8px",borderRadius:20,fontWeight:600}),
    pill:  (s)=>({display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:12,marginBottom:6,cursor:"pointer",background:s?T.greenBg:"#fafaf8",border:s?"1.5px solid "+T.greenL:"1.5px solid "+T.border,minHeight:48,transition:"all 0.15s"}),
    chip:  (c,active)=>({padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",minHeight:36,fontSize:12,fontWeight:active?700:400,background:active?c||T.green:"#f0f0ee",color:active?"#fff":T.sub,display:"inline-flex",alignItems:"center",gap:4,transition:"all 0.15s"}),
    secHdr:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},
  };

  const recColor=recSt==="recording"?T.red:recSt==="done"?T.greenL:T.green;
  const recLabel=recSt==="recording"?`⏹ 停止 (${recSec}秒)`:recSt==="transcribing"?"⏳ 文字起こし中...":recSt==="done"?"✓ 完了！":"🎙 録音開始";

  const navTabs=[
    {id:"input",   icon:"🎙",  label:"録音"},
    {id:"result",  icon:"📋", label:"振り分け"},
    {id:"archive", icon:"📚", label:`記録${total>0?"("+total+")":""}`},
    {id:"doc",     icon:"📄", label:"書類"},
    {id:"timeline",icon:"📈", label:"成長"},
    {id:"chat",    icon:"💬", label:"Chat"},
  ];

  return (
    <div style={css.page}>

      {/* ── ヘッダー ── */}
      <div style={css.hdr}>
        <div style={{fontSize:22}}>🌱</div>
        <div style={{flex:1}}>
          <div style={{color:"#fff",fontWeight:800,fontSize:15,letterSpacing:"0.02em"}}>HoikuMemo</div>
          <div style={{color:"rgba(255,255,255,0.65)",fontSize:9,letterSpacing:"0.04em"}}>子どもの成長データOS</div>
        </div>
        {offlineQ.length>0&&(
          <button onClick={processOfflineQueue} disabled={processingQ} style={{...css.bsm(T.warn),fontSize:10,padding:"5px 10px"}}>
            {processingQ?"⏳":"📥"}{offlineQ.length}件
          </button>
        )}
        <button onClick={()=>setShowSettings(true)} style={{
          width:38,height:38,borderRadius:"50%",border:"none",
          background:"rgba(255,255,255,0.18)",color:"#fff",fontSize:19,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center"
        }}>⚙️</button>
      </div>

      {/* ── 設定モーダル ── */}
      {showSettings&&(
        <div style={css.overlay} onClick={e=>{if(e.target===e.currentTarget)setShowSettings(false);}}>
          <div style={css.modal}>
            {/* モーダルヘッダー */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 20px 0"}}>
              <div style={{fontWeight:800,fontSize:17,color:T.green}}>⚙️ 設定</div>
              <button onClick={()=>setShowSettings(false)} style={{...css.bout,fontSize:20,border:"none",background:"transparent",padding:"4px 8px"}}>✕</button>
            </div>
            {/* 設定タブ */}
            <div style={{display:"flex",gap:0,margin:"14px 20px 0",background:"#f5f5f5",borderRadius:12,padding:3}}>
              {[["roster","👦 名簿"],["policy","🏫 園設定"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setSettingsTab(id)} style={{
                  flex:1,padding:"9px",border:"none",cursor:"pointer",fontSize:13,borderRadius:10,
                  background:settingsTab===id?"#fff":transparent,color:settingsTab===id?T.green:T.sub,
                  fontWeight:settingsTab===id?700:400,boxShadow:settingsTab===id?"0 1px 4px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"
                }}>{lbl}</button>
              ))}
            </div>
            <div style={{padding:"16px 20px"}}>

              {/* 名簿 */}
              {settingsTab==="roster"&&(
                <div>
                  <div style={{...css.secHdr,marginBottom:10}}>
                    <div style={{fontSize:12,color:T.sub}}>正式名とニックネームを登録（なしでも動作します）</div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={exportCSV} style={{...css.bsm(T.sky),fontSize:11,padding:"5px 10px"}}>⬇ CSV</button>
                      <label style={{...css.bsm(T.lavend),fontSize:11,padding:"5px 10px",cursor:"pointer"}}>
                        ⬆ CSV<input type="file" accept=".csv" onChange={importCSV} style={{display:"none"}}/>
                      </label>
                    </div>
                  </div>
                  {Object.entries(roster).map(([cls,children])=>(
                    <div key={cls} style={{marginBottom:18}}>
                      <div style={{fontSize:12,fontWeight:700,color:T.green,padding:"4px 10px",background:T.greenBg,borderRadius:8,display:"inline-flex",alignItems:"center",gap:5,marginBottom:8}}>
                        🏫 {cls}
                      </div>
                      {children.map((child,idx)=>(
                        <div key={idx} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                          <div style={{...css.av(childColor(child.name||"?"),30),fontSize:12}}>{(child.name||"?")[0]}</div>
                          <input value={child.name} onChange={e=>{const u={...roster};u[cls][idx].name=e.target.value;setRoster({...u});}}
                            placeholder="正式名" style={{width:72,...css.inp}}/>
                          <input value={child.nicknames} onChange={e=>{const u={...roster};u[cls][idx].nicknames=e.target.value;setRoster({...u});}}
                            placeholder="ニックネーム（カンマ区切り）" style={{flex:1,...css.inp}}/>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{fontSize:10,color:"#bbb",marginBottom:14}}>※ ニックネームはカンマ区切りで複数登録可</div>
                  <button onClick={saveRoster} style={{...css.btn(false),width:"100%",padding:"13px"}}>💾 名簿を保存</button>
                  {polSaved&&<div style={{textAlign:"center",color:T.greenL,fontSize:13,marginTop:8,fontWeight:700}}>✓ 保存しました</div>}
                </div>
              )}

              {/* 園設定 */}
              {settingsTab==="policy"&&(
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:T.green,marginBottom:10}}>🏫 園方針（管理者）</div>
                  {[
                    {k:"name",lbl:"園名",ph:"〇〇幼稚園"},
                    {k:"philosophy",lbl:"教育理念",ph:"例：主体性を大切にする"},
                    {k:"values",lbl:"大切にしている価値観",ph:"例：失敗を恐れずチャレンジする心"},
                    {k:"goals",lbl:"子どもに身につけてほしいこと",ph:"例：思いやり・自分で考える力"},
                  ].map(f=>(
                    <div key={f.k} style={{marginBottom:10}}>
                      <div style={css.lbl}>{f.lbl}</div>
                      <textarea value={gp[f.k]||""} onChange={e=>setGp({...gp,[f.k]:e.target.value})} placeholder={f.ph} style={{...css.ta,minHeight:44}}/>
                    </div>
                  ))}
                  <div style={{fontWeight:700,fontSize:14,color:T.peach,marginTop:16,marginBottom:10}}>📋 クラス設定（担任）</div>
                  {[
                    {k:"classGoal",lbl:"クラス目標",ph:"例：友達に自分から声を掛けられるようになる"},
                    {k:"monthTheme",lbl:"今月のテーマ",ph:"例：集団遊びへの参加を増やす"},
                    {k:"awareness",lbl:"意識していること",ph:"例：一人ひとりの気持ちに寄り添う"},
                  ].map(f=>(
                    <div key={f.k} style={{marginBottom:10}}>
                      <div style={css.lbl}>{f.lbl}</div>
                      <textarea value={cp[f.k]||""} onChange={e=>setCp({...cp,[f.k]:e.target.value})} placeholder={f.ph} style={{...css.ta,minHeight:44}}/>
                    </div>
                  ))}
                  <button onClick={savePolicy} style={{...css.btn(false),width:"100%",padding:"13px",marginTop:6}}>💾 設定を保存する</button>
                  {polSaved&&<div style={{textAlign:"center",color:T.greenL,fontSize:13,marginTop:8,fontWeight:700}}>✓ 保存しました</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={css.wrap}>

        {/* ══ 録音・入力 ══ */}
        {tab==="input"&&(
          <div>
            {/* ── 録音ヒーローエリア ── */}
            <div style={{
              background: recSt==="recording"
                ? "linear-gradient(160deg,#3a0a0a,#7a1a1a)"
                : recSt==="done"
                ? "linear-gradient(160deg,#0a3a1a,#1a6a3a)"
                : "linear-gradient(160deg,#1a3a28,#2d6a3f)",
              borderRadius:20,
              padding:"28px 20px 24px",
              marginBottom:12,
              textAlign:"center",
              transition:"all 0.4s",
              boxShadow: recSt==="recording"
                ? "0 8px 32px rgba(229,57,53,0.3)"
                : "0 8px 32px rgba(58,125,68,0.25)",
            }}>
              {/* 状態テキスト */}
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginBottom:16,letterSpacing:"0.05em",fontWeight:500}}>
                {recSt==="idle"    && "タップして今日の記録を話してください"}
                {recSt==="recording" && `🔴 録音中 ${recSec}秒 — もう一度タップで停止`}
                {recSt==="transcribing" && "✨ 文字起こし中..."}
                {recSt==="done"    && "✓ 文字起こし完了！"}
              </div>

              {/* 録音ボタン本体（大きな円形） */}
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                <button
                  onClick={recSt==="recording"?stopRec:startRec}
                  disabled={recSt==="transcribing"}
                  style={{
                    width:100,height:100,borderRadius:"50%",border:"none",cursor:recSt==="transcribing"?"not-allowed":"pointer",
                    background: recSt==="recording"
                      ? "radial-gradient(circle,#ff5252,#c62828)"
                      : recSt==="transcribing"
                      ? "#666"
                      : recSt==="done"
                      ? "radial-gradient(circle,#81c784,#388e3c)"
                      : "radial-gradient(circle,#81c784,#2e7d32)",
                    fontSize:36,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    boxShadow: recSt==="recording"
                      ? "0 0 0 8px rgba(255,82,82,0.2),0 0 0 16px rgba(255,82,82,0.1)"
                      : recSt==="done"
                      ? "0 0 0 8px rgba(129,199,132,0.3)"
                      : "0 0 0 8px rgba(129,199,132,0.2),0 4px 20px rgba(46,125,50,0.4)",
                    transition:"all 0.3s",
                    transform: recSt==="recording"?"scale(1.05)":"scale(1)",
                  }}
                >
                  {recSt==="recording" ? "⏹" : recSt==="transcribing" ? "⏳" : recSt==="done" ? "✓" : "🎙"}
                </button>
              </div>

              {/* 録音中のウェーブアニメーション */}
              {recSt==="recording"&&(
                <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:8}}>
                  {[0,1,2,3,4,3,2,1,0].map((h,i)=>(
                    <div key={i} style={{
                      width:3,height:6+h*4,background:"rgba(255,255,255,0.6)",borderRadius:2,
                      animation:`wave 0.8s ${i*0.09}s ease-in-out infinite alternate`
                    }}/>
                  ))}
                </div>
              )}

              {recErr&&(
                <div style={{marginTop:8,fontSize:12,color:recErr.startsWith("📥")?"#ffcc80":"#ff8a80",lineHeight:1.5,background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"6px 10px"}}>
                  {recErr}
                </div>
              )}
            </div>

            {/* ── テンプレート（折りたたみ） ── */}
            <div style={css.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:showTpl?10:0}}>
                <div style={{fontSize:12,color:T.sub,fontWeight:600}}>💡 発話テンプレート</div>
                <button onClick={()=>setShowTpl(!showTpl)} style={{...css.bout,fontSize:11,padding:"4px 10px"}}>{showTpl?"閉じる":"開く"}</button>
              </div>
              {showTpl&&(
                <div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                    {TEMPLATE_PROMPTS.map((t,i)=>(
                      <button key={i}
                        onClick={()=>setInput(p=>p?p+(p.endsWith("。")||p.endsWith("\n")?"":"\n")+t.text:t.text)}
                        style={{...css.chip(T.green,false),background:T.greenBg,color:T.green,border:"1px solid #c8e6a0",minHeight:36,padding:"6px 13px"}}>
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>
                  <div style={{padding:9,background:"#f9f7ee",borderRadius:9,border:"1px solid #e8e0c0",fontSize:11,color:"#888",lineHeight:1.8}}>
                    例：「<b style={{color:T.green}}>今日の〇〇組です。</b>気になった子は<b style={{color:T.green}}>たけるくん</b>で、自分から片付けをしていました。」
                  </div>
                </div>
              )}
            </div>

            {/* ── テキストエリア ── */}
            <div style={css.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={css.lbl}>発話テキスト</div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:11,color:"#ccc"}}>{inputText.length}文字</span>
                  {inputText&&<button onClick={()=>{setInput("");setSample("");}} style={{...css.bout,fontSize:11,padding:"4px 9px"}}>クリア</button>}
                </div>
              </div>
              <textarea value={inputText} onChange={e=>setInput(e.target.value)}
                placeholder="録音後に自動で入力されます。直接入力もできます..."
                style={{...css.ta,minHeight:110,marginBottom:10}}/>
              <button onClick={handleAnalyze} disabled={loading||!inputText.trim()}
                style={{
                  ...css.btn(loading||!inputText.trim()),
                  width:"100%",padding:"14px",fontSize:15,borderRadius:14,
                  boxShadow:inputText.trim()&&!loading?"0 4px 16px "+T.green+"55":"none"
                }}>
                {loading?"⏳ 解析中...":"園児別に振り分ける →"}
              </button>
              {errMsg&&<div style={{marginTop:8,padding:10,background:"#fff5f5",borderRadius:10,color:T.red,fontSize:12,lineHeight:1.6}}>⚠️ {errMsg}</div>}
            </div>

            {/* ── サンプル（一番下・折りたたみ） ── */}
            <details style={{marginBottom:4}}>
              <summary style={{fontSize:11,color:"#bbb",cursor:"pointer",padding:"6px 0",listStyle:"none",display:"flex",alignItems:"center",gap:4}}>
                <span>▶</span> サンプルを読み込む（動作確認用）
              </summary>
              <div style={{...css.card,marginTop:6,padding:"10px 14px"}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {Object.keys(SAMPLE_TEXTS).map(k=>(
                    <button key={k} onClick={()=>{setInput(SAMPLE_TEXTS[k]);setSample(k);setResult(null);}} style={css.chip(T.green,sample===k)}>{k}</button>
                  ))}
                </div>
              </div>
            </details>
          </div>
        )}

        {/* ══ 振り分け結果 ══ */}
        {tab==="result"&&(
          <div>
            {!result?(
              <div style={{...css.card,textAlign:"center",padding:"48px 20px",color:"#ccc"}}>
                <div style={{fontSize:48,marginBottom:12}}>📋</div>
                <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>まだ振り分け結果がありません</div>
                <div style={{fontSize:12}}>「録音」タブで入力して「園児別に振り分ける」を押してください</div>
              </div>
            ):(
              <div>
                {/* 移動先選択バー */}
                {moveEp&&(
                  <div style={{...css.card,background:"#fff8ef",border:"1.5px solid #ffe082"}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.warn,marginBottom:8}}>↗️ 移動先の園児を選んでください</div>
                    <div style={{fontSize:12,color:"#666",background:"#fff",padding:"6px 10px",borderRadius:8,marginBottom:10,lineHeight:1.6}}>
                      「{moveEp.text.slice(0,35)}{moveEp.text.length>35?"...":""}」
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {Object.keys(result["園児記録"]||{}).filter(n=>n!==moveEp.childName).map(name=>(
                        <button key={name} onClick={()=>executeMoveEp(name)}
                          style={{...css.bsm(childColor(name)),minHeight:40,gap:6}}>
                          <span style={{...css.av(childColor(name),20),fontSize:10}}>{name[0]}</span>{name}
                        </button>
                      ))}
                      <button onClick={()=>setMoveEp(null)} style={{...css.bout,minHeight:40}}>キャンセル</button>
                    </div>
                  </div>
                )}

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:16,color:T.green}}>{result["クラス"]}</div>
                    <div style={{fontSize:11,color:T.sub}}>{todayStr()}</div>
                  </div>
                  <button onClick={handleSave}
                    style={{...css.bsm(saveStatus==="saved"?T.greenL:saveStatus==="error"?T.red:T.green),padding:"9px 18px",fontSize:13}}>
                    {saveStatus==="saved"?"✓ 保存完了":saveStatus==="error"?"✗ 失敗":"📥 蓄積保存"}
                  </button>
                </div>

                {Object.entries(result["園児記録"]||{}).map(([name,eps])=>{
                  const ea=Array.isArray(eps)?eps:[eps];
                  const color=childColor(name);
                  return(
                    <div key={name} style={{...css.card,overflow:"hidden",padding:0,marginBottom:12}}>
                      {/* 園児ヘッダー */}
                      <div style={{background:`linear-gradient(135deg,${color}22,${color}0a)`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid "+T.border}}>
                        <span style={css.av(color,32)}>{name[0]}</span>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:14,color:T.text}}>{name}</div>
                          {records[name]?.length>0&&<div style={{fontSize:10,color:T.sub}}>累計{records[name].length}日分の記録</div>}
                        </div>
                        <div style={{fontSize:10,color:T.sub,background:"rgba(255,255,255,0.6)",padding:"3px 8px",borderRadius:8}}>
                          {ea.length}件
                        </div>
                      </div>

                      {/* エピソードリスト */}
                      <div style={{padding:"6px 12px 10px"}}>
                        {ea.map((ep,i)=>(
                          <div key={i}>
                            {editEp?.childName===name&&editEp?.epIndex===i ? (
                              /* ── 編集モード ── */
                              <div style={{margin:"6px 0",padding:12,background:T.greenBg,borderRadius:12,border:"1.5px solid "+T.greenL}}>
                                <textarea
                                  value={editEpText}
                                  onChange={e=>setEditEpText(e.target.value)}
                                  style={{...css.ta,minHeight:80,marginBottom:10,background:"#fff",fontSize:13}}
                                  autoFocus
                                />
                                <div style={{display:"flex",gap:8}}>
                                  <button onClick={saveEditEp}
                                    style={{...css.bsm(T.green),flex:2,minHeight:44,fontSize:14}}>
                                    ✓ 保存
                                  </button>
                                  <button onClick={()=>setEditEp(null)}
                                    style={{...css.bout,flex:1,minHeight:44}}>
                                    取消
                                  </button>
                                  <button onClick={()=>deleteEp(name,i)}
                                    style={{...css.bsm(T.red),minHeight:44,padding:"0 14px"}}>
                                    🗑
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* ── 通常表示 ── */
                              <div style={{
                                padding:"10px 4px",
                                borderBottom:i<ea.length-1?"1px solid "+T.border:"none",
                              }}>
                                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                                  <div style={{width:8,height:8,borderRadius:"50%",background:color,marginTop:6,flexShrink:0}}/>
                                  {/* テキスト部分タップで編集 */}
                                  <div
                                    onClick={()=>startEditEp(name,i,ep)}
                                    style={{flex:1,fontSize:13,lineHeight:1.75,color:T.text,cursor:"pointer",paddingRight:8}}
                                  >
                                    {ep}
                                  </div>
                                </div>
                                {/* 操作ボタン行 */}
                                <div style={{display:"flex",gap:6,marginTop:8,paddingLeft:18}}>
                                  <button
                                    onClick={()=>startEditEp(name,i,ep)}
                                    style={{
                                      flex:1,minHeight:40,borderRadius:10,
                                      border:"1.5px solid "+T.border,
                                      background:"#f8f9f8",color:T.sub,
                                      fontSize:12,cursor:"pointer",
                                      display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontWeight:600
                                    }}>
                                    ✏️ 編集・加筆
                                  </button>
                                  <button
                                    onClick={()=>startMoveEp(name,i,ep)}
                                    style={{
                                      flex:1,minHeight:40,borderRadius:10,
                                      border:"1.5px solid "+T.border,
                                      background:"#f8f9f8",color:T.sub,
                                      fontSize:12,cursor:"pointer",
                                      display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontWeight:600
                                    }}>
                                    ↗️ 別の子へ移動
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* ＋ エピソード追加ボタン */}
                        <button
                          onClick={()=>{
                            const nr={...result,["園児記録"]:{...result["園児記録"]}};
                            nr["園児記録"][name]=[...ea,""];
                            setResult(nr);
                            setEditEp({childName:name,epIndex:ea.length});
                            setEditEpText("");
                          }}
                          style={{
                            width:"100%",marginTop:8,minHeight:38,borderRadius:10,
                            border:"1.5px dashed "+T.greenL,
                            background:T.greenBg,color:T.green,
                            fontSize:12,cursor:"pointer",fontWeight:600,
                            display:"flex",alignItems:"center",justifyContent:"center",gap:4
                          }}>
                          ＋ エピソードを追加
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ 蓄積記録 ══ */}
        {tab==="archive"&&(
          <div>
            {!ready?(
              <div style={{...css.card,textAlign:"center",padding:"36px",color:"#ccc"}}>読み込み中...</div>
            ):allChildren.length===0?(
              <div style={{...css.card,textAlign:"center",padding:"48px 20px",color:"#ccc"}}>
                <div style={{fontSize:48,marginBottom:12}}>📚</div>
                <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>まだ記録がありません</div>
                <div style={{fontSize:12}}>振り分け後に「蓄積保存」してください</div>
              </div>
            ):(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                  {allChildren.map(name=>(
                    <button key={name} onClick={()=>setSelC(selChild===name?null:name)} style={{
                      padding:"12px 6px",borderRadius:14,border:"none",cursor:"pointer",
                      background:selChild===name?T.green:"#fff",
                      border:selChild===name?"none":"1.5px solid "+T.border,
                      display:"flex",flexDirection:"column",alignItems:"center",gap:6,minHeight:80,
                      boxShadow:selChild===name?"0 4px 12px "+T.green+"44":"0 2px 6px rgba(0,0,0,0.04)",
                      transition:"all 0.15s"
                    }}>
                      <span style={css.av(selChild===name?T.greenL:childColor(name),36)}>{name[0]}</span>
                      <div style={{fontSize:12,fontWeight:700,color:selChild===name?"#fff":T.text}}>{name}</div>
                      <div style={{fontSize:10,color:selChild===name?"rgba(255,255,255,0.7)":T.sub}}>{records[name]?.length||0}日分</div>
                    </button>
                  ))}
                </div>

                {selChild&&(
                  <div style={css.card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={css.av(childColor(selChild),36)}>{selChild[0]}</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:15,color:T.text}}>{selChild}</div>
                          <div style={{fontSize:11,color:T.sub}}>{records[selChild]?.length||0}日分の記録</div>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                      <button onClick={()=>{setDocChild(selChild);const k=selChild+"_"+docMode;setDocDraft(docSaved[k]||null);setTab("doc");}} style={css.bsm(T.sky)}>📄 書類作成</button>
                      <button onClick={()=>{setTlChild(selChild);setTab("timeline");}} style={css.bsm(T.lavend)}>📈 成長記録</button>
                      <button onClick={()=>{setChatChild(selChild);setChatHist([]);setTab("chat");}} style={css.bsm(T.peach)}>💬 Chat</button>
                    </div>
                    {(records[selChild]||[]).map((entry,idx)=>(
                      <div key={idx} style={{marginBottom:8,border:"1px solid "+T.border,borderRadius:12,overflow:"hidden"}}>
                        <div style={{background:"#f8f9f6",padding:"7px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:11,fontWeight:700,color:T.sub}}>{entry.date}</span>
                          <span style={css.tag()}>{entry.className}</span>
                        </div>
                        <div style={{padding:"8px 12px"}}>
                          {(entry.episodes||[]).map((ep,i)=>(
                            <div key={i} style={{fontSize:12,lineHeight:1.8,color:T.text,padding:"3px 0",borderBottom:i<entry.episodes.length-1?"1px solid "+T.border:"none",display:"flex",gap:8,alignItems:"flex-start"}}>
                              <div style={{width:6,height:6,borderRadius:"50%",background:childColor(selChild),marginTop:7,flexShrink:0}}/>
                              {ep}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button onClick={()=>delChild(selChild)} style={{...css.bout,width:"100%",marginTop:6,color:T.red,fontSize:12,padding:"9px"}}>この園児の記録を削除</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ 書類生成 ══ */}
        {tab==="doc"&&(
          <div>
            {/* モード */}
            <div style={{display:"flex",gap:0,marginBottom:12,background:"#f5f5f5",borderRadius:14,padding:4}}>
              {[["youroku","📄 要録","年度末"],["mendan","👥 面談メモ","保護者面談"]].map(([m,label,sub])=>(
                <button key={m} onClick={()=>switchMode(m)} style={{
                  flex:1,padding:"10px 6px",border:"none",cursor:"pointer",fontSize:13,borderRadius:10,
                  background:docMode===m?"#fff":"transparent",color:docMode===m?T.green:T.sub,
                  fontWeight:docMode===m?700:400,
                  boxShadow:docMode===m?"0 2px 8px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"
                }}>
                  {label}<br/><span style={{fontSize:10,opacity:0.65}}>{sub}</span>
                </button>
              ))}
            </div>

            {/* 園児選択 */}
            <div style={css.card}>
              <div style={css.lbl}>園児を選択</div>
              {allChildren.length===0?<div style={{fontSize:12,color:"#bbb"}}>蓄積記録がありません</div>:(
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {allChildren.map(name=>{
                    const key=name+"_"+docMode;const hasDraft=!!docSaved[key];
                    return(
                      <button key={name} onClick={()=>selectDocChild(name)}
                        style={css.chip(childColor(name),docChild===name)}>
                        <span style={{...css.av(docChild===name?childColor(name):childColor(name),18),fontSize:9,boxShadow:"none"}}>{name[0]}</span>
                        {name}{hasDraft&&<span style={{fontSize:9}}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {docChild&&(
              <div>
                <div style={{...css.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={css.av(childColor(docChild),32)}>{docChild[0]}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:T.text}}>{docChild}</div>
                      <div style={{fontSize:10,color:T.sub}}>{records[docChild]?.length||0}日分から生成</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {docDraft&&<button onClick={()=>setShowAI(!showAI)} style={css.bsm(showAI?"#999":T.lavend)}>{showAI?"✕":"✨ AI修正"}</button>}
                    <button onClick={()=>handleGenDoc(docChild)} disabled={docLoad} style={css.btn(docLoad)}>
                      {docLoad?"⏳...":docDraft?"🔄 再生成":"📄 生成"}
                    </button>
                  </div>
                </div>

                {docErr&&<div style={{...css.card,color:T.red,fontSize:12,padding:"10px 14px"}}>⚠️ {docErr}</div>}
                {docLoad&&<div style={{...css.card,textAlign:"center",padding:"32px",color:T.sub}}><div style={{fontSize:28,marginBottom:8}}>⏳</div><div>生成中...</div></div>}

                {docDraft&&showAI&&(
                  <div style={{...css.card,background:"#f8f5ff",border:"1.5px solid #d4c8f8"}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.lavend,marginBottom:10}}>✨ AI修正指示</div>
                    <div style={{marginBottom:8}}>
                      <div style={css.lbl}>対象項目</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <button onClick={()=>setAiTgt(null)} style={css.chip(T.lavend,aiTgt===null)}>全体</button>
                        {currentFields.map(f=><button key={f.key} onClick={()=>setAiTgt(f.key)} style={css.chip(T.lavend,aiTgt===f.key)}>{f.icon}{f.key}</button>)}
                      </div>
                    </div>
                    <textarea value={aiInstr} onChange={e=>setAiInstr(e.target.value)}
                      placeholder="例：もっと具体的に / 文章を短く / ポジティブな表現に" style={{...css.ta,minHeight:60,marginBottom:8}}/>
                    <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                      <button onClick={()=>{setShowAI(false);setAiInstr("");}} style={{...css.bout,minHeight:40}}>キャンセル</button>
                      <button onClick={handleAiRevise} disabled={revising||!aiInstr.trim()} style={{...css.btn(revising||!aiInstr.trim(),T.lavend),minHeight:40}}>
                        {revising?"⏳ 修正中...":"✨ 修正する"}
                      </button>
                    </div>
                  </div>
                )}

                {docDraft&&!docLoad&&(
                  <div>
                    {currentFields.map(f=>(
                      <div key={f.key} style={{...css.card,padding:0,overflow:"hidden"}}>
                        <div style={{background:"#f8f9f6",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+T.border}}>
                          <div style={{fontWeight:700,fontSize:13,color:T.text}}>{f.icon} {f.label}</div>
                          {editF===f.key?(
                            <div style={{display:"flex",gap:6}}>
                              <button onClick={handleDirectSave} style={{...css.bsm(T.greenL),minHeight:34,fontSize:11}}>保存</button>
                              <button onClick={()=>setEditF(null)} style={{...css.bout,minHeight:34,fontSize:11}}>取消</button>
                            </div>
                          ):(
                            <button onClick={()=>{setEditF(f.key);setEditT(docDraft[f.key]||"");}} style={{...css.bsm(T.peach),minHeight:34,fontSize:11}}>✏️ 編集</button>
                          )}
                        </div>
                        <div style={{padding:"12px 14px"}}>
                          {editF===f.key
                            ?<textarea value={editT} onChange={e=>setEditT(e.target.value)} style={{...css.ta,minHeight:80,background:"#fffdf7"}} autoFocus/>
                            :<div style={{fontSize:13,lineHeight:1.9,color:T.text,whiteSpace:"pre-wrap"}}>{docDraft[f.key]||"（未生成）"}</div>
                          }
                        </div>
                      </div>
                    ))}
                    {docDraft._policy_note&&(
                      <div style={{...css.card,background:T.greenBg,border:"1px solid #c8e6a0",fontSize:12,color:T.green,padding:"10px 14px"}}>
                        ✓ {docDraft._policy_note}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ 成長タイムライン ══ */}
        {tab==="timeline"&&(
          <div>
            <div style={css.card}>
              <div style={css.lbl}>園児を選択</div>
              {allChildren.length===0?<div style={{fontSize:12,color:"#bbb"}}>蓄積記録がありません</div>:(
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {allChildren.map(name=>(
                    <button key={name} onClick={()=>setTlChild(name)}
                      style={css.chip(T.lavend,tlChild===name)}>
                      <span style={{...css.av(tlChild===name?T.lavend:childColor(name),18),fontSize:9,boxShadow:"none"}}>{name[0]}</span>
                      {name}{tlData[name]?.length>0&&<span style={{fontSize:9}}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {tlChild&&(
              <div>
                <div style={{...css.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={css.av(childColor(tlChild),32)}>{tlChild[0]}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:T.lavend}}>{tlChild}</div>
                      <div style={{fontSize:10,color:T.sub}}>{records[tlChild]?.length||0}日分から生成</div>
                    </div>
                  </div>
                  <button onClick={()=>handleGenTl(tlChild)} disabled={tlLoad} style={css.btn(tlLoad,T.lavend)}>
                    {tlLoad?"⏳...":tlData[tlChild]?.length?"🔄 再生成":"📈 生成"}
                  </button>
                </div>
                {tlErr&&<div style={{...css.card,color:T.red,fontSize:12}}>⚠️ {tlErr}</div>}
                {tlData[tlChild]?.length>0&&(
                  <div style={{...css.card,paddingLeft:28,position:"relative"}}>
                    <div style={{position:"absolute",left:22,top:14,bottom:14,width:2,background:"linear-gradient(to bottom,"+T.lavend+","+T.lavend+"44)",borderRadius:2}}/>
                    {tlData[tlChild].map((item,i)=>(
                      <div key={i} style={{position:"relative",marginBottom:18,paddingLeft:16}}>
                        <div style={{position:"absolute",left:-7,top:4,width:14,height:14,borderRadius:"50%",background:T.lavend,border:"2px solid #fff",boxShadow:"0 0 0 3px "+T.lavend+"33"}}/>
                        <div style={{fontSize:12,fontWeight:700,color:T.lavend,marginBottom:4}}>{item.month}</div>
                        <div style={{fontSize:13,lineHeight:1.7,color:T.text,background:"#f8f5ff",padding:"9px 12px",borderRadius:10}}>{item.summary}</div>
                      </div>
                    ))}
                  </div>
                )}
                {!tlData[tlChild]?.length&&!tlLoad&&(
                  <div style={{...css.card,textAlign:"center",padding:"40px 20px",color:"#ccc"}}>
                    <div style={{fontSize:40,marginBottom:10}}>📈</div>
                    <div style={{fontSize:13}}>「生成」を押すと月ごとの成長変化を可視化します</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ 保育Chat ══ */}
        {tab==="chat"&&(
          <div>
            <div style={css.card}>
              <div style={css.lbl}>相談したい園児を選択</div>
              {allChildren.length===0?<div style={{fontSize:12,color:"#bbb"}}>蓄積記録がありません</div>:(
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[...allChildren,"全体"].map(name=>(
                    <button key={name} onClick={()=>{setChatChild(name);setChatHist([]);}}
                      style={css.chip(T.peach,chatChild===name)}>
                      {name!=="全体"&&<span style={{...css.av(chatChild===name?T.peach:childColor(name),18),fontSize:9,boxShadow:"none"}}>{name[0]}</span>}
                      {name==="全体"?"🏫 全体":name}
                      {name!=="全体"&&records[name]&&<span style={{fontSize:9,opacity:0.7}}>{records[name].length}日</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {chatChild&&(
              <div>
                <div style={{...css.card,padding:"10px 12px",minHeight:260,maxHeight:400,overflowY:"auto",background:"#faf9f7"}}>
                  {chatHistory.length===0&&(
                    <div style={{textAlign:"center",padding:"32px 16px",color:"#ccc"}}>
                      <div style={{fontSize:36,marginBottom:10}}>💬</div>
                      <div style={{fontSize:14,fontWeight:600,marginBottom:6,color:"#aaa"}}>
                        {chatChild==="全体"?"クラス全体":"「"+chatChild+"」"}について相談
                      </div>
                      <div style={{fontSize:12,lineHeight:1.7}}>例：「最近一人遊びが多いです。<br/>どう関わればいいですか？」</div>
                    </div>
                  )}
                  {chatHistory.map((msg,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",marginBottom:10,gap:8}}>
                      {msg.role==="assistant"&&<div style={{...css.av(T.greenL,28),fontSize:14,flexShrink:0}}>🌱</div>}
                      <div style={{
                        maxWidth:"80%",padding:"10px 13px",
                        borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                        background:msg.role==="user"?T.green:"#fff",
                        color:msg.role==="user"?"#fff":T.text,
                        fontSize:13,lineHeight:1.7,
                        border:msg.role==="assistant"?"1px solid "+T.border:"none",
                        whiteSpace:"pre-wrap",
                        boxShadow:"0 2px 6px rgba(0,0,0,0.06)"
                      }}>{msg.content}</div>
                      {msg.role==="user"&&<div style={{...css.av("#e0e0e0",28),fontSize:14,flexShrink:0}}>👩</div>}
                    </div>
                  ))}
                  {chatLoad&&(
                    <div style={{display:"flex",gap:8,marginBottom:10}}>
                      <div style={{...css.av(T.greenL,28),fontSize:14,flexShrink:0}}>🌱</div>
                      <div style={{padding:"10px 13px",borderRadius:"16px 16px 16px 4px",background:"#fff",border:"1px solid "+T.border,fontSize:13,color:"#aaa"}}>
                        記録を参照中...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}/>
                </div>
                <div style={{...css.card,display:"flex",gap:8,padding:"10px 12px",marginTop:0,borderTop:"none",borderRadius:"0 0 16px 16px"}}>
                  <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleChat();}}}
                    placeholder="質問を入力... (Enterで送信)"
                    style={{...css.ta,minHeight:48,flex:1,marginBottom:0,fontSize:13,borderRadius:10}}/>
                  <button onClick={handleChat} disabled={chatLoad||!chatInput.trim()}
                    style={{...css.btn(chatLoad||!chatInput.trim()),padding:"0 16px",alignSelf:"stretch",fontSize:20,minWidth:52,borderRadius:12}}>
                    {chatLoad?"⏳":"↑"}
                  </button>
                </div>
                <div style={{fontSize:10,color:"#ccc",textAlign:"center",marginTop:6}}>
                  {chatChild!=="全体"?`${chatChild}の${records[chatChild]?.length||0}日分の記録`:"クラス全体の記録"}を文脈として使用中
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── ボトムナビ ── */}
      <div style={css.nav}>
        {navTabs.map(({id,icon,label})=>(
          <button key={id} onClick={()=>setTab(id)} style={css.navBtn(tab===id)}>
            <span style={{fontSize:22,lineHeight:1,transition:"transform 0.15s",transform:tab===id?"scale(1.15)":"scale(1)"}}>{icon}</span>
            <span style={{fontSize:9}}>{label}</span>
            {tab===id&&<div style={{width:4,height:4,borderRadius:"50%",background:T.green,marginTop:1}}/>}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes wave{from{transform:scaleY(0.4);}to{transform:scaleY(1.6);}}
        * { -webkit-tap-highlight-color: transparent; }
        textarea:focus, input:focus { border-color: ${T.greenL} !important; box-shadow: 0 0 0 3px ${T.greenL}22; }
      `}</style>
    </div>
  );
}
