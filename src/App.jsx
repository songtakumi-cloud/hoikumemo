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
  {icon:"🍽️",label:"給食・生活",   text:"給食や生活面では"},
  {icon:"⚠️",label:"気になる点",   text:"気になる点として"},
  {icon:"💡",label:"来週意識したいこと",text:"来週意識したいのは"},
];

const YOUROKU_FIELDS = [
  {key:"心身の健康",     label:"心身の健康・生活習慣",    icon:"💪"},
  {key:"人との関わり",   label:"人との関わり・社会性",    icon:"🤝"},
  {key:"遊びへの取り組み",label:"遊び・学びへの取り組み", icon:"🎨"},
  {key:"言葉と表現",     label:"言葉・表現",              icon:"💬"}
];

// 面談メモの項目（要録より現場感が強い）
const MENDAN_FIELDS = [
  {key:"最近の様子",   label:"最近の様子",        icon:"👀"},
  {key:"得意なこと",   label:"得意なこと・強み",  icon:"⭐"},
  {key:"成長した点",   label:"成長した点",        icon:"🌱"},
  {key:"友達関係",     label:"お友達との関わり",  icon:"🤝"},
  {key:"気になる点",   label:"気になる点",        icon:"⚠️"},
  {key:"今後の関わり", label:"今後の関わり方",    icon:"💡"},
];

const COLORS = ["#7ab648","#e07b39","#5b9bd5","#c45c8a","#8e6bbf","#3aaa8f"];
function childColor(n){let h=0;for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%COLORS.length;return COLORS[h];}
function todayStr(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}

// ─── プロンプト ───────────────────────────────────────
function buildAnalyzePrompt(text, roster, gp, cp) {
  const rt=Object.entries(roster).map(([cls,ch])=>cls+": "+ch.map(c=>c.name+"("+c.nicknames+")").join(", ")).join("\n");
  const pol=(gp.philosophy||cp.classGoal)?`\n【園方針】${gp.philosophy||""}${cp.classGoal?" / クラス目標: "+cp.classGoal:""}\n`:"";
  return `あなたは保育記録整理システムです。園児名簿の通称を正式名に名寄せし、発話記録から各園児のエピソードを抽出してください。${pol}
【園児名簿】\n${rt}\n【発話記録】\n${text}
以下のJSON形式のみで出力。説明文・コードブロック禁止。
{"クラス":"クラス名","園児記録":{"正式名":["エピソード1","エピソード2"]}}
ルール:登場しない園児は含めない/先生の評価・印象も含める/JSONのみ返す`;
}

function buildDocPrompt(mode, childName, entries, gp) {
  const all=entries.map(e=>`【${e.date} ${e.className}】\n`+e.episodes.join("\n")).join("\n\n");
  const hasPol=!!(gp.philosophy||gp.values||gp.goals);
  const pol=hasPol?`\n【園の教育理念・方針】\n${[gp.philosophy,gp.values,gp.goals].filter(Boolean).join(" / ")}\n`:"";
  const polNote=hasPol
    ? `\n末尾に必ず1行追記してください：「※ ${gp.name||"園"}の教育理念（${(gp.philosophy||"").slice(0,20)}）を踏まえて生成しています。」`
    : "";
  if (mode==="youroku") {
    return `あなたは幼稚園・保育園の書類作成支援システムです。${pol}
以下は「${childName}」の保育記録です。要録（指導要録）に使える文章を作成してください。
【保育記録】\n${all}
各項目2〜4文、丁寧・客観的な文体で。${polNote}
JSONのみ返してください。
{"心身の健康":"","人との関わり":"","遊びへの取り組み":"","言葉と表現":"","_policy_note":""}`;
  } else {
    return `あなたは幼稚園・保育園の書類作成支援システムです。${pol}
以下は「${childName}」の保育記録です。保護者面談に使える資料を作成してください。
【保育記録】\n${all}
各項目1〜3文、保護者に伝わる温かみのある文体で。${polNote}
JSONのみ返してください。
{"最近の様子":"","得意なこと":"","成長した点":"","友達関係":"","気になる点":"","今後の関わり":"","_policy_note":""}`;
  }
}

function buildRevisePrompt(childName, draft, instruction, mode) {
  const fields=mode==="youroku"
    ? '{"心身の健康":"","人との関わり":"","遊びへの取り組み":"","言葉と表現":""}'
    : '{"最近の様子":"","得意なこと":"","成長した点":"","友達関係":"","気になる点":"","今後の関わり":""}';
  return `「${childName}」の書類ドラフトを以下の指示で修正してください。
【現在のドラフト】\n${JSON.stringify(draft,null,2)}
【修正指示】\n${instruction}
JSONのみ返してください: ${fields}`;
}

function buildTimelinePrompt(childName, entries) {
  const all=entries.map(e=>`【${e.date} ${e.className}】\n`+e.episodes.join("\n")).join("\n\n");
  return `以下は「${childName}」の保育記録です。月ごとの成長変化を時系列でまとめてください。
【保育記録】\n${all}
各月の成長・変化を1〜2文で。JSONのみ返してください。
{"timeline":[{"month":"YYYY年MM月","summary":"成長の要約"}]}`;
}

function buildChatPrompt(childName, records, question, history, gp) {
  const entries=records[childName]||[];
  const all=entries.length>0
    ? entries.map(e=>`【${e.date} ${e.className}】\n`+e.episodes.join("\n")).join("\n\n")
    : "（記録なし）";
  const pol=gp.philosophy?`\n【園の教育理念】${gp.philosophy}\n`:"";
  const historyText=history.length>0
    ? "\n【これまでの会話】\n"+history.map(h=>`${h.role==="user"?"先生":"AI"}: ${h.content}`).join("\n")+"\n"
    : "";
  return `あなたは保育専門のAIアドバイザーです。${pol}
以下は「${childName}」の蓄積された保育記録です。この記録を根拠に、先生の質問に答えてください。
【${childName}の保育記録】\n${all}
${historyText}
【先生の質問】\n${question}

回答のルール：
- 記録から具体的な日付・エピソードを引用して根拠を示す
- 記録にない情報は推測だと明示する
- 先生に寄り添う温かいトーンで、200文字以内で簡潔に答える
- 記録がない場合はその旨を伝え、一般的なアドバイスを添える`;
}

// ─── API ─────────────────────────────────────────────
async function callClaude(prompt) {
  let res;
  try {
    res = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }]
      })
    });
  } catch(e) {
    throw new Error("fetch失敗: " + e.message);
  }

  let data;
  try {
    data = await res.json();
  } catch(e) {
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} / レスポンス: ${t.slice(0, 120)}`);
  }

  if (data.error) throw new Error(`APIエラー: ${data.error.message}`);
  const raw = (data.content || []).find(b => b.type === "text")?.text || "";
  if (!raw) throw new Error("空のレスポンス: " + JSON.stringify(data).slice(0, 100));
  return raw;
}
async function callClaudeJSON(prompt) {
  const raw=await callClaude(prompt);
  const match=raw.match(/\{[\s\S]*\}/);
  if(!match) throw new Error("JSON見つからず: "+raw.slice(0,80));
  return JSON.parse(match[0]);
}
async function whisper(blob,key) {
  const fd=new FormData();
  const ext=blob.type.includes("mp4")||blob.type.includes("m4a")?"m4a":"webm";
  fd.append("file",blob,`rec.${ext}`);fd.append("model","whisper-1");fd.append("language","ja");
  const data=await fetch("/api/whisper",{method:"POST",body:fd}).then(r=>r.json());
  if(data.error) throw new Error("Whisper: "+data.error.message);
  return data.text||"";
}

// ─── ストレージ ───────────────────────────────────────
const SK={rec:"hm-rec-v5",doc:"hm-doc-v2",oai:"hm-oai",gp:"hm-gp",cp:"hm-cp",tl:"hm-tl",offlineQ:"hm-offline-q"};
async function ld(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}}
async function sv(k,d){try{await window.storage.set(k,JSON.stringify(d));return true;}catch{return false;}}

// ─── コンポーネント ───────────────────────────────────
export default function App() {
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

  const [oaiKey,setOaiKey]   = useState("");
  const [keyIn,setKeyIn]     = useState("");
  const [showKey,setShowKey] = useState(false);

  const [recSt,setRecSt]     = useState("idle");
  const [recSec,setRecSec]   = useState(0);
  const [recErr,setRecErr]   = useState("");
  const mrRef                = useRef(null);
  const chunksRef            = useRef([]);
  const timerRef             = useRef(null);
  const [showTpl,setShowTpl] = useState(true);
  // オフライン録音キュー
  const [offlineQ,setOfflineQ]       = useState([]); // [{id,blobUrl,mimeType,timestamp,label}]
  const [processingQ,setProcessingQ] = useState(false);
  const [offlineErr,setOfflineErr]   = useState("");

  // ドラッグ&ドロップ（振り分け修正）
  const [dragEp,setDragEp]     = useState(null);
  const [dragOver,setDragOver] = useState(null);

  // 書類生成（要録＋面談統合）
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

  // 成長タイムライン
  const [tlChild,setTlChild] = useState(null);
  const [tlData,setTlData]   = useState({});
  const [tlLoad,setTlLoad]   = useState(false);
  const [tlErr,setTlErr]     = useState("");

  // 保育Chat
  const [chatChild,setChatChild] = useState(null);
  const [chatHistory,setChatHist]= useState([]);
  const [chatInput,setChatInput] = useState("");
  const [chatLoad,setChatLoad]   = useState(false);
  const chatEndRef               = useRef(null);

  // 園設定
  const [gp,setGp] = useState({name:"",philosophy:"",concept:"",values:"",policy:"",goals:""});
  const [cp,setCp] = useState({classGoal:"",monthTheme:"",awareness:""});
  const [polSaved,setPolSaved] = useState(false);

  useEffect(()=>{
    Promise.all([ld(SK.rec),ld(SK.doc),ld(SK.oai),ld(SK.gp),ld(SK.cp),ld(SK.tl),ld(SK.offlineQ)])
      .then(([r,d,k,g,c,t,oq])=>{
        setRec(r||{});setDocSaved(d||{});
        if(k) setOaiKey(k);if(g) setGp(g);if(c) setCp(c);setTlData(t||{});
        setOfflineQ(oq||[]);
        setReady(true);
      });
  },[]);
  useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current);},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatHistory]);

  // ─── 録音 ──────────────────────────────────────────
  const startRec=async()=>{
    setRecErr("");setRecSec(0);chunksRef.current=[];
    if(!oaiKey){setShowKey(true);setRecErr("OpenAI APIキーを設定してください");return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:false});
      const mime=MediaRecorder.isTypeSupported("audio/webm")?"audio/webm":"audio/mp4";
      const mr=new MediaRecorder(stream,{mimeType:mime});
      mrRef.current=mr;
      mr.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data);};
      mr.onstop=async()=>{
        stream.getTracks().forEach(t=>t.stop());
        const blob=new Blob(chunksRef.current,{type:mime});
        const isOnline=navigator.onLine;
        if(isOnline&&oaiKey){
          // オンライン：即時文字起こし
          try{const t=await whisper(blob,oaiKey);setInput(p=>p?p+"\n\n"+t:t);setRecSt("done");setTimeout(()=>setRecSt("idle"),2000);}
          catch(e){setRecErr(e.message);setRecSt("idle");}
        } else {
          // オフライン：BlobをBase64でキューに保存
          const reader=new FileReader();
          reader.onload=async()=>{
            const entry={id:Date.now(),b64:reader.result,mimeType:mime,timestamp:todayStr(),label:`録音 ${new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"})}`};
            const newQ=[...offlineQ,entry];
            setOfflineQ(newQ);
            await sv(SK.offlineQ,newQ);
            setRecSt("idle");
            setRecErr("📥 オフライン保存しました。オンライン時に「一括文字起こし」で処理できます。");
          };
          reader.readAsDataURL(blob);
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

  // ─── オフラインキュー一括文字起こし ──────────────────
  const processOfflineQueue=async()=>{
    if(!oaiKey){setOfflineErr("OpenAI APIキーが必要です");return;}
    if(!navigator.onLine){setOfflineErr("オフラインです。接続後に実行してください");return;}
    setProcessingQ(true);setOfflineErr("");
    const results=[];
    for(const item of offlineQ){
      try{
        // Base64→Blob変換
        const res=await fetch(item.b64);
        const blob=await res.blob();
        const text=await whisper(blob,oaiKey);
        results.push({...item,text});
      }catch(e){results.push({...item,error:e.message});}
    }
    // 成功分をテキストエリアに追加
    const texts=results.filter(r=>r.text).map(r=>`【${r.label}】\n${r.text}`).join("\n\n");
    if(texts) setInput(p=>p?p+"\n\n"+texts:texts);
    // 成功分をキューから除去
    const failed=results.filter(r=>r.error);
    setOfflineQ(failed);
    await sv(SK.offlineQ,failed);
    setProcessingQ(false);
    if(failed.length>0) setOfflineErr(`${failed.length}件の処理に失敗しました`);
  };

  const removeOfflineItem=async(id)=>{
    const newQ=offlineQ.filter(i=>i.id!==id);
    setOfflineQ(newQ);await sv(SK.offlineQ,newQ);
  };

  // ─── ドラッグ&ドロップ（振り分け修正） ───────────────
  const handleDragStart=(fromChild,epIndex,text)=>{
    setDragEp({fromChild,epIndex,text});
  };
  const handleDrop=(toChild)=>{
    if(!dragEp||dragEp.fromChild===toChild) return;
    const newResult={...result};
    const from=newResult["園児記録"][dragEp.fromChild];
    // 元の園児からエピソードを削除
    newResult["園児記録"][dragEp.fromChild]=from.filter((_,i)=>i!==dragEp.epIndex);
    if(newResult["園児記録"][dragEp.fromChild].length===0) delete newResult["園児記録"][dragEp.fromChild];
    // 移動先に追加
    if(!newResult["園児記録"][toChild]) newResult["園児記録"][toChild]=[];
    newResult["園児記録"][toChild]=[...newResult["園児記録"][toChild],dragEp.text];
    setResult(newResult);
    setDragEp(null);setDragOver(null);
  };

  // ─── CSVインポート / エクスポート ─────────────────────
  const exportCSV=()=>{
    const rows=["クラス,正式名,通称"];
    Object.entries(roster).forEach(([cls,children])=>{
      children.forEach(c=>rows.push(`"${cls}","${c.name}","${c.nicknames}"`));
    });
    const csv=rows.join("\n");
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="hoikumemo_roster.csv";a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV=(e)=>{
    const file=e.target.files?.[0];if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const lines=ev.target.result.replace(/^\uFEFF/,"").split("\n").slice(1); // ヘッダー除去
      const newRoster={};
      lines.forEach(line=>{
        if(!line.trim()) return;
        const parts=line.split(",").map(s=>s.replace(/^"|"$/g,"").trim());
        if(parts.length<2) return;
        const [cls,name,nicknames=""]=parts;
        if(!newRoster[cls]) newRoster[cls]=[];
        newRoster[cls].push({name,nicknames});
      });
      if(Object.keys(newRoster).length>0){
        setRoster(newRoster);
        alert("名簿をインポートしました（"+Object.values(newRoster).flat().length+"名）");
      } else {
        alert("インポートに失敗しました。CSV形式を確認してください。");
      }
    };
    reader.readAsText(file,"UTF-8");
    e.target.value="";
  };

  // ─── 振り分け ─────────────────────────────────────
  const handleAnalyze=async()=>{
    if(!inputText.trim()) return;
    setLoad(true);setErr("");setResult(null);
    try{
      const parsed=await callClaudeJSON(buildAnalyzePrompt(inputText,roster,gp,cp));
      if(!parsed["園児記録"]) throw new Error("園児記録なし");
      setResult(parsed);setTab("result");
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

  // ─── 書類生成（要録＋面談統合） ─────────────────────
  const currentFields = docMode==="youroku" ? YOUROKU_FIELDS : MENDAN_FIELDS;

  const handleGenDoc=async(childName)=>{
    const entries=records[childName];
    if(!entries?.length){setDocErr("記録がありません");return;}
    setDocLoad(true);setDocErr("");setDocDraft(null);setEditF(null);setShowAI(false);
    try{
      const parsed=await callClaudeJSON(buildDocPrompt(docMode,childName,entries,gp));
      setDocDraft(parsed);
      const key=childName+"_"+docMode;
      const upd={...docSaved,[key]:parsed};
      setDocSaved(upd);await sv(SK.doc,upd);
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

  // docModeを切り替えるとき、保存済みドラフトをロード
  const switchMode=(mode)=>{
    setDocMode(mode);setEditF(null);setShowAI(false);setDocErr("");
    if(docChild){
      const key=docChild+"_"+mode;
      setDocDraft(docSaved[key]||null);
    }
  };
  const selectDocChild=(name)=>{
    setDocChild(name);setEditF(null);setShowAI(false);setDocErr("");
    const key=name+"_"+docMode;
    setDocDraft(docSaved[key]||null);
  };

  // ─── 成長タイムライン ─────────────────────────────
  const handleGenTl=async(name)=>{
    const entries=records[name];
    if(!entries?.length){setTlErr("記録がありません");return;}
    setTlLoad(true);setTlErr("");
    try{
      const parsed=await callClaudeJSON(buildTimelinePrompt(name,entries));
      const upd={...tlData,[name]:parsed.timeline||[]};
      setTlData(upd);await sv(SK.tl,upd);
    }catch(e){setTlErr(e.message);}finally{setTlLoad(false);}
  };

  // ─── 保育Chat ─────────────────────────────────────
  const handleChat=async()=>{
    if(!chatInput.trim()||!chatChild) return;
    const userMsg={role:"user",content:chatInput};
    const newHist=[...chatHistory,userMsg];
    setChatHist(newHist);setChatInput("");setChatLoad(true);
    try{
      const raw=await callClaude(buildChatPrompt(chatChild,records,chatInput,chatHistory,gp));
      setChatHist([...newHist,{role:"assistant",content:raw}]);
    }catch(e){setChatHist([...newHist,{role:"assistant",content:"⚠️ エラー: "+e.message}]);}
    finally{setChatLoad(false);}
  };

  // ─── 園設定保存 ───────────────────────────────────
  const savePolicy=async()=>{
    await Promise.all([sv(SK.gp,gp),sv(SK.cp,cp)]);
    setPolSaved(true);setTimeout(()=>setPolSaved(false),2000);
  };

  // ─── 派生値 ───────────────────────────────────────
  const allChildren=Object.keys(records).sort();
  const total=Object.values(records).reduce((s,a)=>s+a.length,0);

  // ─── スタイル ─────────────────────────────────────
  const G="#2d5016",L="#7ab648",BG="#f7f6f2",BD="#e5e2d8";
  const S={
    page:{fontFamily:"'Hiragino Kaku Gothic Pro','Noto Sans JP',sans-serif",background:BG,minHeight:"100vh"},
    hdr:{background:G,padding:"12px 16px",display:"flex",alignItems:"center",gap:9},
    icon:{width:28,height:28,borderRadius:"50%",background:L,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14},
    wrap:{maxWidth:700,margin:"0 auto",padding:"12px 9px"},
    card:{background:"#fff",borderRadius:10,padding:"11px 13px",marginBottom:9,border:"1px solid "+BD},
    lbl:{fontSize:11,color:"#999",fontWeight:600,marginBottom:5},
    bar:{display:"flex",gap:2},
    tb:(a)=>({flex:1,padding:"7px 2px",borderRadius:"7px 7px 0 0",border:"none",background:a?"#fff":"#ede9df",color:a?G:"#999",fontWeight:a?700:400,fontSize:10,cursor:"pointer",borderBottom:a?"2px solid "+L:"none"}),
    body:{background:"#fff",borderRadius:"0 0 10px 10px",padding:14,border:"1px solid "+BD,borderTop:"none"},
    btn:(d,c)=>({padding:"7px 16px",borderRadius:7,border:"none",background:d?"#ccc":c||G,color:"#fff",fontWeight:700,fontSize:12,cursor:d?"not-allowed":"pointer"}),
    bsm:(c)=>({padding:"4px 11px",borderRadius:6,border:"none",background:c||G,color:"#fff",fontWeight:600,fontSize:11,cursor:"pointer"}),
    bout:{padding:"4px 9px",borderRadius:6,border:"1.5px solid #ddd",background:"#fff",color:"#666",fontSize:11,cursor:"pointer"},
    pill:(s)=>({display:"flex",alignItems:"center",gap:5,padding:"5px 7px",borderRadius:8,marginBottom:3,cursor:"pointer",background:s?"#f0f7e8":"#fafaf8",border:s?"1.5px solid "+L:"1.5px solid #eee"}),
    epR:(l)=>({fontSize:12,lineHeight:1.8,color:"#444",padding:"3px 0",borderBottom:l?"none":"1px dashed #eee"}),
    av:(c,sz)=>({width:sz,height:sz,borderRadius:"50%",background:c,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:sz*0.44,color:"#fff",fontWeight:700,flexShrink:0}),
    ec:{marginBottom:7,border:"1.5px solid "+BD,borderRadius:9,overflow:"hidden"},
    eh:{background:"#f7f6f2",padding:"5px 9px",display:"flex",justifyContent:"space-between",alignItems:"center"},
    tag:(bg)=>({fontSize:10,background:bg||"#e8f4dc",color:bg?"#fff":G,padding:"2px 7px",borderRadius:10,fontWeight:600}),
    dc:{marginBottom:9,border:"1.5px solid "+BD,borderRadius:9,overflow:"hidden"},
    dh:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 11px",background:"#f7f6f2"},
    ta:{width:"100%",padding:7,borderRadius:6,border:"1.5px solid #ddd",fontSize:12,lineHeight:1.7,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none"},
    inp:{width:"100%",padding:"6px 8px",borderRadius:6,border:"1.5px solid #ddd",fontSize:12,fontFamily:"inherit",boxSizing:"border-box"},
  };

  const recColor=recSt==="recording"?"#c0392b":recSt==="done"?L:G;
  const recLabel=recSt==="recording"?`⏹ 停止(${recSec}秒)`:recSt==="transcribing"?"⏳ 文字起こし中...":recSt==="done"?"✓ 完了":"🎙️ 録音開始";

  const tabs=[
    ["input","🎙️ 録音・入力"],
    ["result","📋 振り分け"],
    ["archive","📚 蓄積"+(total>0?`(${total})`:"")],
    ["doc","📄 書類生成"],
    ["timeline","📈 成長記録"],
    ["chat","💬 保育Chat"],
    ["policy","🏫 園設定"],
    ["roster","👦 名簿"],
  ];

  return (
    <div style={S.page}>
      {/* ヘッダー */}
      <div style={S.hdr}>
        <div style={S.icon}>🌱</div>
        <div style={{flex:1}}>
          <div style={{color:"#fff",fontWeight:700,fontSize:13}}>HoikuMemo</div>
          <div style={{color:"#a8cc7a",fontSize:9}}>子どもの成長データOS</div>
        </div>
        <button onClick={()=>setShowKey(!showKey)} style={{padding:"3px 9px",borderRadius:5,border:"none",fontSize:10,background:oaiKey?L:"#e07b39",color:"#fff",cursor:"pointer",fontWeight:600}}>
          {oaiKey?"🔑 設定済":"🔑 APIキー未設定"}
        </button>
      </div>

      {/* APIキーパネル */}
      {showKey&&(
        <div style={{background:"#fffbf0",borderBottom:"1px solid #f0e8cc",padding:"10px 16px"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{...S.lbl,marginBottom:5}}>OpenAI APIキー（Whisper用）</div>
            <div style={{display:"flex",gap:7}}>
              <input type="password" value={keyIn} onChange={e=>setKeyIn(e.target.value)} placeholder="sk-..." style={{...S.inp,flex:1}}/>
              <button onClick={async()=>{if(!keyIn.trim())return;setOaiKey(keyIn.trim());await sv(SK.oai,keyIn.trim());setShowKey(false);setKeyIn("");setRecErr("");}} disabled={!keyIn.trim()} style={S.btn(!keyIn.trim())}>保存</button>
              <button onClick={()=>setShowKey(false)} style={S.bout}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      <div style={S.wrap}>
        {/* サンプル */}
        <div style={S.card}>
          <div style={S.lbl}>サンプルを読み込む（動作確認用）</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {Object.keys(SAMPLE_TEXTS).map(k=>(
              <button key={k} onClick={()=>{setInput(SAMPLE_TEXTS[k]);setSample(k);setResult(null);setTab("input");}} style={{
                padding:"3px 11px",borderRadius:20,fontSize:11,cursor:"pointer",
                border:sample===k?"2px solid "+G:"1.5px solid #ddd",
                background:sample===k?"#f0f7e8":"#fafaf8",color:sample===k?G:"#666",fontWeight:sample===k?700:400
              }}>{k}</button>
            ))}
          </div>
        </div>

        {/* タブバー */}
        <div style={S.bar}>
          {tabs.map(([id,lbl])=><button key={id} onClick={()=>setTab(id)} style={S.tb(tab===id)}>{lbl}</button>)}
        </div>

        <div style={S.body}>

          {/* ══ 録音・入力 ══ */}
          {tab==="input"&&(
            <div>
              <div style={{marginBottom:12,padding:12,background:"#f7f6f2",borderRadius:9,border:"1.5px solid "+BD}}>
                <div style={S.lbl}>音声録音</div>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
                  <button onClick={recSt==="recording"?stopRec:startRec} disabled={recSt==="transcribing"}
                    style={{...S.btn(recSt==="transcribing",recColor),padding:"10px 20px",fontSize:13,
                      boxShadow:recSt==="recording"?"0 0 0 4px rgba(192,57,43,0.2)":"none",transition:"all 0.2s"}}>
                    {recLabel}
                  </button>
                  {recSt==="recording"&&<div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:4,height:8+i*6,background:"#c0392b",borderRadius:2,animation:`wave 0.8s ${i*0.15}s ease-in-out infinite alternate`}}/>)}</div>}
                </div>
                {recSt==="done"&&<div style={{fontSize:11,color:L,fontWeight:600}}>✓ 文字起こし完了</div>}
                {recErr&&<div style={{fontSize:11,color:recErr.startsWith("📥")?"#e07b39":"#c0392b",marginTop:3}}>{recErr}</div>}
                {!oaiKey&&recSt==="idle"&&<div style={{fontSize:11,color:"#e07b39",marginTop:3}}>⚠️ 右上からOpenAI APIキーを設定すると録音が使えます</div>}
              </div>

              {/* オフラインキュー */}
              {offlineQ.length>0&&(
                <div style={{marginBottom:12,padding:11,background:"#fff8ef",borderRadius:9,border:"1.5px solid #f0d8b0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                    <div style={{fontWeight:700,fontSize:12,color:"#c07020"}}>
                      📥 オフライン保存済み録音（{offlineQ.length}件）
                    </div>
                    <button onClick={processOfflineQueue} disabled={processingQ||!navigator.onLine}
                      style={S.bsm(processingQ||!navigator.onLine?"#ccc":"#e07b39")}>
                      {processingQ?"⏳ 処理中...":"⚡ 一括文字起こし"}
                    </button>
                  </div>
                  {offlineErr&&<div style={{fontSize:11,color:"#c00",marginBottom:6}}>⚠️ {offlineErr}</div>}
                  {offlineQ.map(item=>(
                    <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",background:"#fff",borderRadius:6,marginBottom:4,border:"1px solid #e8d8b0"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:"#555"}}>{item.label}</div>
                        <div style={{fontSize:10,color:"#aaa"}}>{item.timestamp}</div>
                      </div>
                      <button onClick={()=>removeOfflineItem(item.id)} style={{...S.bout,fontSize:10,padding:"2px 7px",color:"#c00"}}>削除</button>
                    </div>
                  ))}
                  <div style={{fontSize:10,color:"#aaa",marginTop:5}}>※ オンライン接続後に「一括文字起こし」を押すと自動でテキスト化されます</div>
                </div>
              )}

              {/* テンプレート */}
              <div style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div style={S.lbl}>💡 発話テンプレート（タップして挿入）</div>
                  <button onClick={()=>setShowTpl(!showTpl)} style={{...S.bout,fontSize:10,padding:"2px 7px"}}>{showTpl?"隠す":"表示"}</button>
                </div>
                {showTpl&&(
                  <div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
                      {TEMPLATE_PROMPTS.map((t,i)=>(
                        <button key={i} onClick={()=>setInput(p=>p?p+(p.endsWith("。")||p.endsWith("\n")?"":"\n")+t.text:t.text)} style={{
                          padding:"5px 11px",borderRadius:20,border:"1.5px solid #c8e6a0",background:"#f0f7e8",
                          color:G,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontWeight:500
                        }}>{t.icon}{t.label}</button>
                      ))}
                    </div>
                    <div style={{padding:9,background:"#f9f7ee",borderRadius:7,border:"1px solid #e8e0c0",fontSize:11,color:"#888",lineHeight:1.7}}>
                      💬 例：「<span style={{color:G,fontWeight:600}}>今日の〇〇組です。</span>気になった子は<span style={{color:G,fontWeight:600}}>たけるくん</span>で、自分から片付けをしていました。成長したと感じたのは友達へ声を掛けることが増えた点です。」
                    </div>
                  </div>
                )}
              </div>

              <div style={S.lbl}>発話テキスト（録音後自動入力 / 直接入力も可）</div>
              <textarea value={inputText} onChange={e=>setInput(e.target.value)} placeholder="録音ボタンを押して話すか、直接入力してください..."
                style={{...S.ta,minHeight:120,background:"#fafaf8",marginBottom:9}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <span style={{fontSize:11,color:"#bbb"}}>{inputText.length}文字</span>
                  {inputText&&<button onClick={()=>{setInput("");setSample("");}} style={{...S.bout,fontSize:10,padding:"2px 7px"}}>クリア</button>}
                </div>
                <button onClick={handleAnalyze} disabled={loading||!inputText.trim()} style={S.btn(loading||!inputText.trim())}>
                  {loading?"⏳ 解析中...":"園児別に振り分ける →"}
                </button>
              </div>
              {errMsg&&<div style={{marginTop:7,padding:8,background:"#fff0f0",borderRadius:7,color:"#c00",fontSize:11,wordBreak:"break-all",lineHeight:1.6}}>⚠️ {errMsg}</div>}
            </div>
          )}

          {/* ══ 振り分け結果 ══ */}
          {tab==="result"&&(
            <div>
              {!result?<div style={{textAlign:"center",padding:"26px 0",color:"#bbb",fontSize:13}}>振り分け結果がありません</div>:(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
                    <div style={{fontWeight:700,fontSize:14,color:G}}>{result["クラス"]} <span style={{fontSize:11,color:"#aaa",fontWeight:400}}>{todayStr()}</span></div>
                    <button onClick={handleSave} style={S.bsm(saveStatus==="saved"?L:saveStatus==="error"?"#c00":G)}>
                      {saveStatus==="saved"?"✓ 保存完了":saveStatus==="error"?"✗ 失敗":"📥 蓄積保存"}
                    </button>
                  </div>
                  <div style={{fontSize:10,color:"#888",marginBottom:8,padding:"6px 9px",background:"#f9f7ee",borderRadius:6,border:"1px solid #e8e0c0"}}>
                    💡 エピソードをドラッグ → 別の園児カードにドロップして割り当てを修正できます
                  </div>
                  {Object.entries(result["園児記録"]||{}).map(([name,eps])=>{
                    const ea=Array.isArray(eps)?eps:[eps];const color=childColor(name);
                    const isOver=dragOver===name;
                    return(
                      <div key={name}
                        onDragOver={e=>{e.preventDefault();setDragOver(name);}}
                        onDragLeave={()=>setDragOver(null)}
                        onDrop={()=>handleDrop(name)}
                        style={{marginBottom:8,border:isOver?"2px dashed "+L:"1.5px solid "+BD,borderRadius:9,overflow:"hidden",background:isOver?"#f0f7e8":"#fff",transition:"all 0.15s"}}>
                        <div style={{background:"#f7f6f2",padding:"5px 10px",display:"flex",alignItems:"center",gap:6}}>
                          <span style={S.av(color,22)}>{name[0]}</span>
                          <span style={{fontWeight:700,fontSize:13}}>{name}</span>
                          {records[name]?.length>0&&<span style={S.tag()}>累計{records[name].length}日</span>}
                          {isOver&&dragEp?.fromChild!==name&&<span style={{fontSize:10,color:L,fontWeight:600,marginLeft:"auto"}}>ここにドロップ</span>}
                        </div>
                        <div style={{padding:"6px 10px"}}>
                          {ea.map((ep,i)=>(
                            <div key={i}
                              draggable
                              onDragStart={()=>handleDragStart(name,i,ep)}
                              onDragEnd={()=>{setDragEp(null);setDragOver(null);}}
                              style={{...S.epR(i===ea.length-1),cursor:"grab",padding:"4px 4px 4px 0",
                                background:dragEp?.fromChild===name&&dragEp?.epIndex===i?"#fff8e1":"transparent",
                                borderRadius:4,userSelect:"none"}}>
                              <span style={{color:"#bbb",marginRight:4,fontSize:10}}>⠿</span>
                              <span style={{color,marginRight:4}}>•</span>{ep}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* ══ 蓄積記録 ══ */}
          {tab==="archive"&&(
            <div>
              {!ready?<div style={{textAlign:"center",padding:"26px 0",color:"#bbb"}}>読み込み中...</div>
              :allChildren.length===0?<div style={{textAlign:"center",padding:"26px 0",color:"#bbb",fontSize:13}}>まだ記録がありません<br/><span style={{fontSize:11}}>振り分け後に蓄積保存してください</span></div>
              :(
                <div style={{display:"flex",gap:9}}>
                  <div style={{width:88,flexShrink:0}}>
                    <div style={{...S.lbl,marginBottom:6}}>園児({allChildren.length})</div>
                    {allChildren.map(name=>(
                      <div key={name} onClick={()=>setSelC(name)} style={S.pill(selChild===name)}>
                        <span style={S.av(childColor(name),19)}>{name[0]}</span>
                        <div><div style={{fontSize:11,fontWeight:600,color:"#333"}}>{name}</div><div style={{fontSize:9,color:"#aaa"}}>{records[name]?.length||0}日</div></div>
                      </div>
                    ))}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    {!selChild?<div style={{textAlign:"center",padding:"26px 0",color:"#bbb",fontSize:12}}>園児を選択</div>:(
                      <>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={S.av(childColor(selChild),22)}>{selChild[0]}</span>
                            <span style={{fontWeight:700,fontSize:13,color:G}}>{selChild}</span>
                            <span style={{fontSize:10,color:"#aaa"}}>{records[selChild]?.length||0}日分</span>
                          </div>
                          <div style={{display:"flex",gap:4}}>
                            <button onClick={()=>{setDocChild(selChild);const k=selChild+"_"+docMode;setDocDraft(docSaved[k]||null);setTab("doc");}} style={S.bsm("#5b9bd5")}>書類</button>
                            <button onClick={()=>{setTlChild(selChild);setTab("timeline");}} style={S.bsm("#8e6bbf")}>成長</button>
                            <button onClick={()=>{setChatChild(selChild);setChatHist([]);setTab("chat");}} style={S.bsm("#e07b39")}>Chat</button>
                            <button onClick={()=>delChild(selChild)} style={{...S.bout,fontSize:10}}>削除</button>
                          </div>
                        </div>
                        {(records[selChild]||[]).map((entry,idx)=>(
                          <div key={idx} style={S.ec}>
                            <div style={S.eh}><span style={{fontSize:10,fontWeight:700,color:"#555"}}>{entry.date}</span><span style={S.tag()}>{entry.className}</span></div>
                            <div style={{padding:"5px 9px"}}>
                              {(entry.episodes||[]).map((ep,i)=><div key={i} style={S.epR(i===entry.episodes.length-1)}><span style={{color:childColor(selChild),marginRight:4}}>•</span>{ep}</div>)}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ 書類生成（要録＋面談統合） ══ */}
          {tab==="doc"&&(
            <div>
              {/* モード切り替え */}
              <div style={{display:"flex",gap:0,marginBottom:14,border:"1.5px solid "+BD,borderRadius:9,overflow:"hidden"}}>
                {[["youroku","📄 要録","年度末の指導要録"],["mendan","👥 保護者面談メモ","面談準備資料"]].map(([m,label,sub])=>(
                  <button key={m} onClick={()=>switchMode(m)} style={{
                    flex:1,padding:"9px 4px",border:"none",cursor:"pointer",
                    background:docMode===m?G:"#f7f6f2",color:docMode===m?"#fff":"#666",
                    fontWeight:docMode===m?700:400,fontSize:12,borderRight:m==="youroku"?"1px solid "+BD:"none"
                  }}>
                    {label}<br/><span style={{fontSize:9,opacity:0.7}}>{sub}</span>
                  </button>
                ))}
              </div>

              {/* 園児選択 */}
              <div style={{marginBottom:13}}>
                <div style={S.lbl}>園児を選択</div>
                {allChildren.length===0?<div style={{fontSize:12,color:"#bbb"}}>蓄積記録がありません</div>:(
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {allChildren.map(name=>{
                      const key=name+"_"+docMode;const hasDraft=!!docSaved[key];
                      return(
                        <button key={name} onClick={()=>selectDocChild(name)} style={{
                          display:"flex",alignItems:"center",gap:4,padding:"4px 11px",borderRadius:20,border:"none",cursor:"pointer",
                          background:docChild===name?G:hasDraft?"#e8f4dc":"#f0f0ee",
                          color:docChild===name?"#fff":hasDraft?G:"#666",fontWeight:docChild===name?700:400,fontSize:12
                        }}>
                          <span style={{...S.av(docChild===name?L:childColor(name),17),fontSize:8}}>{name[0]}</span>
                          {name}{hasDraft&&<span style={{fontSize:9,opacity:0.7}}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {docChild&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11,paddingBottom:9,borderBottom:"1.5px solid #f0ede6"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={S.av(childColor(docChild),24)}>{docChild[0]}</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:G}}>{docChild}</div>
                        <div style={{fontSize:10,color:"#aaa"}}>{records[docChild]?.length||0}日分の記録から生成</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                      {docDraft&&<button onClick={()=>setShowAI(!showAI)} style={S.bsm(showAI?"#666":"#8e6bbf")}>{showAI?"✕ 閉じる":"✨ AI修正"}</button>}
                      <button onClick={()=>handleGenDoc(docChild)} disabled={docLoad} style={S.btn(docLoad)}>
                        {docLoad?"⏳ 生成中...":docDraft?"🔄 再生成":docMode==="youroku"?"📄 要録生成":"👥 面談メモ生成"}
                      </button>
                    </div>
                  </div>

                  {docErr&&<div style={{padding:7,background:"#fff0f0",borderRadius:7,color:"#c00",fontSize:11,marginBottom:9}}>⚠️ {docErr}</div>}
                  {docLoad&&<div style={{textAlign:"center",padding:"28px 0",color:"#888"}}><div style={{fontSize:22,marginBottom:7}}>⏳</div><div style={{fontSize:13}}>生成中...</div></div>}

                  {/* AI修正パネル */}
                  {docDraft&&showAI&&(
                    <div style={{marginBottom:12,padding:11,background:"#f3f0fb",borderRadius:9,border:"1.5px solid #c8b8f0"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#5b3ea8",marginBottom:7}}>✨ AI修正指示</div>
                      <div style={{marginBottom:7}}>
                        <div style={S.lbl}>対象項目</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          <button onClick={()=>setAiTgt(null)} style={{...S.bsm(aiTgt===null?"#5b3ea8":"#ccc"),fontSize:10}}>全体</button>
                          {currentFields.map(f=><button key={f.key} onClick={()=>setAiTgt(f.key)} style={{...S.bsm(aiTgt===f.key?"#5b3ea8":"#ccc"),fontSize:10}}>{f.icon}{f.key}</button>)}
                        </div>
                      </div>
                      <textarea value={aiInstr} onChange={e=>setAiInstr(e.target.value)}
                        placeholder="例：もっと具体的に / 文章を短く / ポジティブな表現に" style={{...S.ta,minHeight:60,background:"#fff",marginBottom:7}}/>
                      <div style={{display:"flex",justifyContent:"flex-end",gap:5}}>
                        <button onClick={()=>{setShowAI(false);setAiInstr("");}} style={S.bout}>キャンセル</button>
                        <button onClick={handleAiRevise} disabled={revising||!aiInstr.trim()} style={S.btn(revising||!aiInstr.trim())}>
                          {revising?"⏳ 修正中...":"✨ この指示で修正する"}
                        </button>
                      </div>
                    </div>
                  )}

                  {docDraft&&!docLoad&&(
                    <div>
                      {currentFields.map(f=>(
                        <div key={f.key} style={S.dc}>
                          <div style={S.dh}>
                            <div style={{fontWeight:700,fontSize:12,color:"#333"}}>{f.icon} {f.label}</div>
                            <div style={{display:"flex",gap:4}}>
                              {editF===f.key?(
                                <><button onClick={handleDirectSave} style={S.bsm(L)}>保存</button><button onClick={()=>setEditF(null)} style={S.bout}>取消</button></>
                              ):(
                                <button onClick={()=>{setEditF(f.key);setEditT(docDraft[f.key]||"");}} style={S.bsm("#e07b39")}>✏️ 直接編集</button>
                              )}
                            </div>
                          </div>
                          <div style={{padding:"9px 11px"}}>
                            {editF===f.key
                              ?<textarea value={editT} onChange={e=>setEditT(e.target.value)} style={{...S.ta,minHeight:80,background:"#fffdf7"}} autoFocus/>
                              :<div style={{fontSize:13,lineHeight:1.9,color:"#333",whiteSpace:"pre-wrap"}}>{docDraft[f.key]||"（未生成）"}</div>
                            }
                          </div>
                        </div>
                      ))}
                      <div style={{fontSize:10,color:"#bbb",textAlign:"right",marginTop:3}}>※ 自動保存済み。転記は確認の上行ってください。</div>
                      {docDraft._policy_note&&(
                        <div style={{marginTop:7,padding:"6px 10px",background:"#f0f7e8",borderRadius:7,border:"1px solid #c8e6a0",fontSize:11,color:G}}>
                          ✓ {docDraft._policy_note}
                        </div>
                      )}
                    </div>
                  )}

                  {!docDraft&&!docLoad&&(
                    <div style={{textAlign:"center",padding:"26px 0",color:"#bbb"}}>
                      <div style={{fontSize:26,marginBottom:7}}>{docMode==="youroku"?"📄":"👥"}</div>
                      <div style={{fontSize:13}}>「{docMode==="youroku"?"要録生成":"面談メモ生成"}」を押して<br/>蓄積記録から書類の下書きを作成します</div>
                    </div>
                  )}
                </div>
              )}
              {!docChild&&allChildren.length>0&&<div style={{textAlign:"center",padding:"22px 0",color:"#bbb",fontSize:13}}>上の園児ボタンを選択してください</div>}
            </div>
          )}

          {/* ══ 成長タイムライン ══ */}
          {tab==="timeline"&&(
            <div>
              <div style={{marginBottom:13}}>
                <div style={S.lbl}>成長タイムラインを表示する園児を選択</div>
                {allChildren.length===0?<div style={{fontSize:12,color:"#bbb"}}>蓄積記録がありません</div>:(
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {allChildren.map(name=>{
                      const hasTl=!!(tlData[name]?.length);
                      return(
                        <button key={name} onClick={()=>setTlChild(name)} style={{
                          display:"flex",alignItems:"center",gap:4,padding:"4px 11px",borderRadius:20,border:"none",cursor:"pointer",
                          background:tlChild===name?"#5b3ea8":hasTl?"#ede8f8":"#f0f0ee",
                          color:tlChild===name?"#fff":hasTl?"#5b3ea8":"#666",fontWeight:tlChild===name?700:400,fontSize:12
                        }}>
                          <span style={{...S.av(tlChild===name?"#8e6bbf":childColor(name),17),fontSize:8}}>{name[0]}</span>
                          {name}{hasTl&&<span style={{fontSize:9,opacity:0.7}}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {tlChild&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11,paddingBottom:9,borderBottom:"1.5px solid #f0ede6"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={S.av(childColor(tlChild),24)}>{tlChild[0]}</span>
                      <div><div style={{fontWeight:700,fontSize:13,color:"#5b3ea8"}}>{tlChild}</div><div style={{fontSize:10,color:"#aaa"}}>{records[tlChild]?.length||0}日分から生成</div></div>
                    </div>
                    <button onClick={()=>handleGenTl(tlChild)} disabled={tlLoad} style={{...S.btn(tlLoad,"#5b3ea8")}}>
                      {tlLoad?"⏳ 生成中...":tlData[tlChild]?.length?"🔄 再生成":"📈 タイムライン生成"}
                    </button>
                  </div>
                  {tlErr&&<div style={{padding:7,background:"#fff0f0",borderRadius:7,color:"#c00",fontSize:11,marginBottom:9}}>⚠️ {tlErr}</div>}
                  {tlLoad&&<div style={{textAlign:"center",padding:"28px 0",color:"#888"}}><div style={{fontSize:22,marginBottom:7}}>⏳</div><div style={{fontSize:13}}>タイムライン生成中...</div></div>}
                  {tlData[tlChild]?.length>0&&!tlLoad&&(
                    <div style={{position:"relative",paddingLeft:18}}>
                      <div style={{position:"absolute",left:6,top:8,bottom:8,width:2,background:"#e0d8f0",borderRadius:1}}/>
                      {tlData[tlChild].map((item,i)=>(
                        <div key={i} style={{position:"relative",marginBottom:14,paddingLeft:18}}>
                          <div style={{position:"absolute",left:-5,top:4,width:11,height:11,borderRadius:"50%",background:"#8e6bbf",border:"2px solid #fff",boxShadow:"0 0 0 2px #e0d8f0"}}/>
                          <div style={{fontSize:11,fontWeight:700,color:"#5b3ea8",marginBottom:2}}>{item.month}</div>
                          <div style={{fontSize:12,lineHeight:1.7,color:"#333",background:"#f8f5ff",padding:"7px 10px",borderRadius:7,border:"1px solid #e0d8f0"}}>{item.summary}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!tlData[tlChild]?.length&&!tlLoad&&(
                    <div style={{textAlign:"center",padding:"26px 0",color:"#bbb"}}><div style={{fontSize:26,marginBottom:7}}>📈</div><div style={{fontSize:13}}>「タイムライン生成」を押すと<br/>月ごとの成長の変化を可視化します</div></div>
                  )}
                </div>
              )}
              {!tlChild&&allChildren.length>0&&<div style={{textAlign:"center",padding:"22px 0",color:"#bbb",fontSize:13}}>上の園児ボタンを選択してください</div>}
            </div>
          )}

          {/* ══ 保育Chat ══ */}
          {tab==="chat"&&(
            <div>
              {/* 園児選択 */}
              <div style={{marginBottom:12}}>
                <div style={S.lbl}>相談したい園児を選択（記録が文脈として渡されます）</div>
                {allChildren.length===0?<div style={{fontSize:12,color:"#bbb"}}>蓄積記録がありません</div>:(
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {allChildren.map(name=>(
                      <button key={name} onClick={()=>{setChatChild(name);setChatHist([]);}} style={{
                        display:"flex",alignItems:"center",gap:4,padding:"4px 11px",borderRadius:20,border:"none",cursor:"pointer",
                        background:chatChild===name?G:"#f0f0ee",color:chatChild===name?"#fff":"#666",fontWeight:chatChild===name?700:400,fontSize:12
                      }}>
                        <span style={{...S.av(chatChild===name?L:childColor(name),17),fontSize:8}}>{name[0]}</span>
                        {name}<span style={{fontSize:9,opacity:0.6}}>{records[name]?.length||0}日</span>
                      </button>
                    ))}
                    <button onClick={()=>{setChatChild("全体");setChatHist([]);}} style={{
                      padding:"4px 11px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,
                      background:chatChild==="全体"?G:"#f0f0ee",color:chatChild==="全体"?"#fff":"#666",fontWeight:chatChild==="全体"?700:400
                    }}>🏫 クラス全体</button>
                  </div>
                )}
              </div>

              {chatChild&&(
                <div>
                  {/* チャット履歴 */}
                  <div style={{minHeight:200,maxHeight:340,overflowY:"auto",marginBottom:10,padding:10,background:"#f9f8f5",borderRadius:9,border:"1.5px solid "+BD}}>
                    {chatHistory.length===0&&(
                      <div style={{textAlign:"center",padding:"20px 0",color:"#bbb"}}>
                        <div style={{fontSize:20,marginBottom:5}}>💬</div>
                        <div style={{fontSize:12,lineHeight:1.7}}>
                          {chatChild==="全体"?"クラス全体":"「"+chatChild+"」"}について何でも相談できます<br/>
                          <span style={{fontSize:11,color:"#ccc"}}>例：最近一人遊びが多いです。どう関わればいいですか？</span>
                        </div>
                      </div>
                    )}
                    {chatHistory.map((msg,i)=>(
                      <div key={i} style={{
                        display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",marginBottom:9
                      }}>
                        {msg.role==="assistant"&&(
                          <div style={{...S.av(L,24),marginRight:6,flexShrink:0,fontSize:12}}>🌱</div>
                        )}
                        <div style={{
                          maxWidth:"80%",padding:"8px 11px",borderRadius:msg.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",
                          background:msg.role==="user"?G:"#fff",color:msg.role==="user"?"#fff":"#333",
                          fontSize:12,lineHeight:1.7,border:msg.role==="assistant"?"1.5px solid "+BD:"none",
                          whiteSpace:"pre-wrap"
                        }}>
                          {msg.content}
                        </div>
                        {msg.role==="user"&&(
                          <div style={{...S.av("#aaa",24),marginLeft:6,flexShrink:0,fontSize:12}}>👩</div>
                        )}
                      </div>
                    ))}
                    {chatLoad&&(
                      <div style={{display:"flex",justifyContent:"flex-start",marginBottom:9}}>
                        <div style={{...S.av(L,24),marginRight:6,flexShrink:0,fontSize:12}}>🌱</div>
                        <div style={{padding:"8px 14px",borderRadius:"12px 12px 12px 2px",background:"#fff",border:"1.5px solid "+BD,fontSize:12,color:"#aaa"}}>
                          <span style={{animation:"wave 0.8s ease-in-out infinite alternate"}}>●</span> 記録を参照しながら回答中...
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef}/>
                  </div>

                  {/* 入力エリア */}
                  <div style={{display:"flex",gap:7}}>
                    <textarea
                      value={chatInput}
                      onChange={e=>setChatInput(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleChat();}}}
                      placeholder={`${chatChild==="全体"?"クラス全体":chatChild}について質問してください...\n（Enterで送信 / Shift+Enterで改行）`}
                      style={{...S.ta,minHeight:60,flex:1,background:"#fafaf8"}}
                    />
                    <button onClick={handleChat} disabled={chatLoad||!chatInput.trim()} style={{...S.btn(chatLoad||!chatInput.trim()),padding:"0 16px",alignSelf:"stretch",fontSize:18}}>
                      {chatLoad?"⏳":"↑"}
                    </button>
                  </div>

                  {chatHistory.length>0&&(
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}>
                      <button onClick={()=>setChatHist([])} style={{...S.bout,fontSize:10}}>会話をクリア</button>
                    </div>
                  )}

                  <div style={{fontSize:10,color:"#bbb",marginTop:6,lineHeight:1.6}}>
                    💡 {chatChild!=="全体"?`${chatChild}の${records[chatChild]?.length||0}日分の記録`:"クラス全体の記録"}を文脈として渡しています。ChatGPTにできない記録ベースの回答が得られます。
                  </div>
                </div>
              )}
              {!chatChild&&<div style={{textAlign:"center",padding:"26px 0",color:"#bbb",fontSize:13}}>上の園児を選択して相談を始めてください</div>}
            </div>
          )}

          {/* ══ 園設定 ══ */}
          {tab==="policy"&&(
            <div>
              <div style={{marginBottom:18}}>
                <div style={{fontWeight:700,fontSize:13,color:G,marginBottom:9,display:"flex",alignItems:"center",gap:5}}>
                  🏫 園方針設定（管理者）<span style={{fontSize:10,color:"#aaa",fontWeight:400}}>AI出力の基準に反映</span>
                </div>
                {[{k:"name",lbl:"園名",ph:"〇〇幼稚園"},{k:"philosophy",lbl:"教育理念",ph:"例：主体性を大切にする"},{k:"concept",lbl:"園コンセプト",ph:"例：子どもが自分で考え動ける環境"},{k:"values",lbl:"大切にしている価値観",ph:"例：失敗を恐れずチャレンジする心"},{k:"policy",lbl:"教育方針",ph:"例：遊びを通した総合的な発達"},{k:"goals",lbl:"子どもに身につけてほしいこと",ph:"例：思いやり・自分で考える力"}].map(f=>(
                  <div key={f.k} style={{marginBottom:9}}>
                    <div style={S.lbl}>{f.lbl}</div>
                    <textarea value={gp[f.k]||""} onChange={e=>setGp({...gp,[f.k]:e.target.value})} placeholder={f.ph} style={{...S.ta,minHeight:48}}/>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:14,paddingTop:12,borderTop:"1.5px solid "+BD}}>
                <div style={{fontWeight:700,fontSize:13,color:"#e07b39",marginBottom:9,display:"flex",alignItems:"center",gap:5}}>
                  📋 クラス設定（担任）<span style={{fontSize:10,color:"#aaa",fontWeight:400}}>担任も編集可能</span>
                </div>
                {[{k:"classGoal",lbl:"クラス目標",ph:"例：友達に自分から声を掛けられるようになる"},{k:"monthTheme",lbl:"今月の重点テーマ",ph:"例：集団遊びへの参加を増やす"},{k:"awareness",lbl:"意識していること",ph:"例：一人ひとりの気持ちに寄り添う"}].map(f=>(
                  <div key={f.k} style={{marginBottom:9}}>
                    <div style={S.lbl}>{f.lbl}</div>
                    <textarea value={cp[f.k]||""} onChange={e=>setCp({...cp,[f.k]:e.target.value})} placeholder={f.ph} style={{...S.ta,minHeight:44}}/>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"flex-end",gap:7,alignItems:"center"}}>
                {polSaved&&<span style={{fontSize:12,color:L,fontWeight:600}}>✓ 保存しました</span>}
                <button onClick={savePolicy} style={S.btn(false)}>設定を保存する</button>
              </div>
              <div style={{fontSize:10,color:"#bbb",marginTop:7}}>※ 保存後、次回のAI出力に反映されます</div>
            </div>
          )}

          {/* ══ 名簿 ══ */}
          {tab==="roster"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
                <div style={S.lbl}>園児名簿（正式名 ＋ 通称）</div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={exportCSV} style={S.bsm("#5b9bd5")}>⬇ CSVエクスポート</button>
                  <label style={{...S.bsm("#8e6bbf"),cursor:"pointer"}}>
                    ⬆ CSVインポート
                    <input type="file" accept=".csv" onChange={importCSV} style={{display:"none"}}/>
                  </label>
                </div>
              </div>
              <div style={{fontSize:10,color:"#aaa",marginBottom:10,padding:"6px 9px",background:"#f7f6f2",borderRadius:6}}>
                CSV形式：クラス,正式名,通称（カンマ区切り）　1行目はヘッダー行
              </div>
              {Object.entries(roster).map(([cls,children])=>(
                <div key={cls} style={{marginBottom:13}}>
                  <div style={{fontSize:11,fontWeight:700,color:G,padding:"2px 8px",background:"#f0f7e8",borderRadius:5,display:"inline-block",marginBottom:6}}>{cls}</div>
                  {children.map((child,idx)=>(
                    <div key={idx} style={{display:"flex",gap:6,marginBottom:4}}>
                      <input value={child.name} onChange={e=>{const u={...roster};u[cls][idx].name=e.target.value;setRoster({...u});}} placeholder="正式名" style={{width:68,...S.inp}}/>
                      <input value={child.nicknames} onChange={e=>{const u={...roster};u[cls][idx].nicknames=e.target.value;setRoster({...u});}} placeholder="通称（カンマ区切り）" style={{flex:1,...S.inp}}/>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{fontSize:10,color:"#bbb"}}>※ 通称はカンマ区切りで複数登録可能</div>
            </div>
          )}

        </div>
        <div style={{marginTop:7,fontSize:9,color:"#ccc",textAlign:"center"}}>HoikuMemo v0.8 — CSV/ドラッグ&ドロップ/オフライン録音/園方針注記</div>
      </div>
      <style>{`@keyframes wave{from{transform:scaleY(0.5);}to{transform:scaleY(1.5);}}`}</style>
    </div>
  );
}

// localStorage polyfill for window.storage
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = {
    get: async (key) => {
      const v = localStorage.getItem(key);
      return v ? { value: v } : null;
    },
    set: async (key, value) => {
      localStorage.setItem(key, value);
      return { key, value };
    },
    delete: async (key) => {
      localStorage.removeItem(key);
      return { key, deleted: true };
    }
  };
}
