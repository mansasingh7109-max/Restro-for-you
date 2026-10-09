<!doctype html>
<html lang="hi">
<head><style>
@font-face {
  font-family: "Optimistic";
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
  src: url("/fonts/OptimisticAI_VF_Optimized.woff2") format("woff2");
}
@font-face {
  font-family: "Optimistic Mono";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/OptimisticMono_W_TextRegular.woff2") format("woff2");
}
:where(html) {
  font-family: "Optimistic", system-ui, sans-serif;
}
:where(code, pre, kbd, samp) {
  font-family: "Optimistic Mono", ui-monospace, monospace;
}
</style>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tracking - RESTRO FOR YOU</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>window.INVOICE_BRAND='RESTRO_FOR_YOU';</script>
<script src="invoice.js"></script>
<style>
body{font-family:Poppins,Arial;background:#fff8e1;padding:8px;margin:0;padding-bottom:120px}
*{font-family:Poppins,Arial,sans-serif}
.card{background:#fff;border-radius:14px;padding:12px;margin:10px 0;box-shadow:0 2px 8px rgba(0,0,0,.08);border-left:4px solid #ff6a00}
.header{background:linear-gradient(90deg,#ff9800,#e91e63);color:#fff;padding:12px 15px;display:flex;gap:8px;position:sticky;top:0;z-index:100;align-items:center;border-radius:0 0 12px 12px}
.back-btn{background:rgba(255,255,255,.25);border:none;color:#fff;padding:7px 12px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:12px}
.step{display:flex;gap:10px;margin:14px 0}
.circle{width:32px;height:32px;border-radius:50%;background:#e5e7eb;color:#9ca3af;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid #d1d5db;flex-shrink:0}
.circle.green{background:#10b981;color:#fff;border-color:#10b981}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes glow{0%{box-shadow:0 0 0 0 rgba(16,185,129,.5)}100%{box-shadow:0 0 0 14px rgba(16,185,129,0)}}
.circle.active{animation:glow 1.5s infinite;width:44px!important;height:44px!important;font-size:20px!important}
.present-card{border:2px solid #10b981!important;background:#f0fdf4!important;transform:scale(1.02);box-shadow:0 4px 12px rgba(16,185,129,.2)!important}
.moving-smile{font-size:22px;animation:bounce 1s infinite;display:inline-block;margin-left:6px}
.btn{width:100%;padding:14px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;margin-top:10px;font-size:14px;display:block;text-align:center;-webkit-tap-highlight-color:transparent}
.btn-orange{background:#ff6a00;color:#fff}.btn-blue{background:#0ea5e9;color:#fff}.btn-purple{background:#7c3aed;color:#fff}.btn-green{background:#10b981;color:#fff}
.btn:active{transform:scale(0.98)}
</style>
</head>
<body>
<div class="header">
<button class="back-btn" id="topBackBtn" onclick="window.location.href='orders.html'">← Back to Orders</button>
<h1 style="font-size:14px;flex:1">📦 Tracking</h1>
<span id="orderBadge" style="background:#000;color:#0f0;padding:4px 8px;border-radius:6px;font-size:10px">#922585</span>
</div>
<div id="root"><div class="card" style="text-align:center">Loading...</div></div>

<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="whatsapp-inquiry.js"></script>
<script>
// ✅ FINAL FIX - Invoice PDF direct fallback - invoice.js missing bhi ho to bhi PDF banega
window.goBackOrders=function(){ window.location.href='orders.html'; };
window.goToHome=function(){ window.location.href='index.html'; };
window.goWhatsApp=function(){
  try{
    let o=window.currentOrder||{};
    if(window.sendInquiryWhatsApp){ window.sendInquiryWhatsApp(o); return; }
    let id=o.orderId||o.id||''; let st=o.status||'Pending';
    window.open('https://wa.me/918769171078?text=*RESTRO FOR YOU - Tracking*%0AOrder ID: '+encodeURIComponent(id)+'%0AStatus: '+encodeURIComponent(st),'_blank');
  }catch(e){ window.open('https://wa.me/918769171078','_blank'); }
};

// Direct PDF generator - does NOT need invoice.js
function generateInvoiceDirect(order){
  order=order||window.currentOrder||{};
  let items=order.items||order.cart||[];
  if(!items.length){ alert('Order me items nahi hai'); return; }
  let jsPDFClass=(window.jspdf&&window.jspdf.jsPDF)?window.jspdf.jsPDF:window.jsPDF;
  if(!jsPDFClass){ alert('jsPDF CDN load nahi hua - Internet check karo'); return; }
  let cfg={fullName:'RESTRO FOR YOU', soldBy:'Restro For You', thank:'Thank You for Ordering from Restro For You'};
  let invoiceNo=order.orderId||order.id||'RESTRO'+Date.now();
  let dateStr=order.dateTimeHamesha||new Date().toLocaleString('en-IN');
  let customerName=order.customerName||'Customer';
  let mobile=order.mobile||'9660834888';
  let address=order.address||'Address not added';
  let sub=0; items.forEach(it=>sub+=(parseFloat(it.price)||0)*(parseInt(it.qty)||1));
  let del=order.deliveryCharge||80; let grand=order.grandTotal||sub+del;
  let doc=new jsPDFClass('p','mm','a4'); let y=15;
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.text(cfg.fullName,14,y); y+=8;
  doc.setFontSize(12); doc.text('Invoice',14,y); y+=10;
  doc.setFont('helvetica','normal'); doc.setFontSize(10);
  doc.text('Invoice No: '+invoiceNo,14,y); doc.text('Date: '+dateStr,120,y); y+=6;
  doc.text('Customer: '+customerName,14,y); y+=6;
  doc.text('Mobile: '+mobile,14,y); y+=6;
  let addrLines=doc.splitTextToSize('Address: '+address,180); doc.text(addrLines,14,y); y+=addrLines.length*5+4;
  doc.text('Payment: '+(order.paymentMethod||'COD')+' | Status: '+(order.status||'Pending'),14,y); y+=10;
  doc.setFillColor(235,235,235); doc.rect(14,y,182,8,'F');
  doc.setFont('helvetica','bold'); doc.text('Item',15,y+5); doc.text('Qty',95,y+5); doc.text('Price',120,y+5); doc.text('Total',155,y+5); y+=10;
  doc.setFont('helvetica','normal');
  items.forEach(it=>{
    let qty=parseInt(it.qty)||1; let price=parseFloat(it.price)||0; let tot=qty*price;
    doc.text((it.name||'Product').substring(0,35)+' ('+(it.size||'M')+')',15,y); doc.text(String(qty),96,y); doc.text('Rs.'+price,121,y); doc.text('Rs.'+tot,156,y); y+=6;
    if(y>270){ doc.addPage(); y=15; }
  });
  y+=4; doc.text('Subtotal: Rs.'+sub+' | Delivery: Rs.'+del,14,y); y+=6;
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.text('Grand Total: Rs.'+grand,14,y); y+=12;
  doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.text(cfg.thank,14,y);
  doc.save('INVOICE_'+invoiceNo+'.pdf');
}

window.downloadInvoicePDF=function(){
  try{
    console.log('Invoice button pressed');
    // 1. Try invoice.js function if exists
    if(window.generateInvoicePDF && window.currentOrder && typeof window.generateInvoicePDF==='function'){
      // check if invoice.js is real (not our wrapper)
      if(window.generateInvoicePDF.toString().length>200){
        window.generateInvoicePDF(window.currentOrder);
        return;
      }
    }
    // 2. Direct fallback - always works
    generateInvoiceDirect(window.currentOrder);
  }catch(e){ 
    console.error(e);
    // final fallback
    generateInvoiceDirect(window.currentOrder);
  }
};

function getDB(){try{if(!firebase.apps.length){let c={apiKey:"AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",authDomain:"santramarketshoppingmall.firebaseapp.com",projectId:"santramarketshoppingmall",storageBucket:"santramarketshoppingmall.appspot.com",messagingSenderId:"398490252924",appId:"1:398490252924:web:d1b6348b549183b93b7bf9"};firebase.initializeApp(c);}return firebase.firestore();}catch(e){return null;}}
var db=getDB();
function getBrand(){ return {fullName:'RESTRO FOR YOU', soldBy:'Restro For You', kitchen:'Restro For You Kitchen', boy:'Restro For You Delivery Boy'}; }

async function load(){
let p=new URLSearchParams(location.search);let oid=p.get('orderId')||p.get('id')||localStorage.getItem('lastOrderId')||'RESTRO1791466922585';let cfg=getBrand();
document.getElementById('orderBadge').innerText='#'+oid.slice(-6);
let order={id:oid,orderId:oid,items:[{name:'Choti pudi potato veg',qty:1,price:200,code:'1791244689437',size:'M'}],status:'Pending',date:new Date().toISOString(),address:'45, Sastrasardar, Lachu, Jaipur, Rajasthan - 342003',customerName:'Manisha tak',mobile:'9660834888',subtotal:200,deliveryCharge:80,grandTotal:280,paymentMethod:'Cash on Delivery',trackingLocation:'Restro For You Kitchen',courierName:'Restro For You Delivery Boy',trackingNumber:'Will update shortly',dateTimeHamesha:new Date().toLocaleString('en-IN')};
try{if(db){let doc=await db.collection('orders').doc(oid).get();if(!doc.exists)doc=await db.collection('restro_orders').doc(oid).get();if(doc.exists)order={id:doc.id,...doc.data()};}}catch(e){}
window.currentOrder=order;

let s=(order.status||'').toLowerCase();let idx=0;
if(s.includes('pending'))idx=0;
if(s.includes('confirm'))idx=1;
if(s.includes('pack'))idx=2;
if(s.includes('shipped'))idx=3;
if(s.includes('out for'))idx=4;
if(s.includes('delivered'))idx=5;

let safe=(v,f='Team will update shortly')=>{if(!v||v===''||v=='--'||String(v).includes('undefined'))return f;return v;};
let trackingLocation=safe(order.currentTrackingLocation||order.trackingLocation,cfg.kitchen);
let courierName=safe(order.courierName,cfg.boy);
let trackingNumber=safe(order.trackingNumber,'Will update shortly');
let dateTimeHamesha=safe(order.dateTimeHamesha||new Date().toLocaleString('en-IN'));

let steps=[
{title:'Order Confirmed',desc:`Tracking: ${trackingLocation}<br>Courier: ${courierName}<br>AWB: ${trackingNumber}<br>Date: ${dateTimeHamesha}`},
{title:'Order Packed',desc:`${cfg.kitchen}`},
{title:'Package Shipped',desc:`${cfg.soldBy}`},
{title:'Out For Delivery',desc:`${courierName}`},
{title:'Order Delivered',desc:`Enjoy your food!`}
];

let html=`<div class="card" style="background:linear-gradient(90deg,#ff9800,#e91e63);color:#fff;font-weight:800;text-align:center">📦 Order: ${order.id} | ${cfg.fullName}</div><div class="card" style="background:#111;color:#fff;font-weight:800;text-align:center">FOLLOW YOUR ORDER</div>`;

steps.forEach((st,i)=>{
let isPast=i<idx;let isPresent=i===idx;let isFuture=i>idx;
let cls=isFuture?'circle':'circle green'+(isPresent?' active':'');
let tick=isFuture?'○':(isPast?'✓':'😃');
let icons=['📝','📦','🚚','🛵','🏠'];
let cardClass=isPresent?'card present-card':'card';
let textColor=isFuture?'#9ca3af':(isPresent?'#10b981':'#065f46');
html+=`<div class="${cardClass}"><div class="step"><div class="${cls}">${tick}</div><div><b style="color:${textColor}">${icons[i]} ${st.title} ${isPresent?'<span class="moving-smile">😃👉 Yaha hai abhi!</span>':''} ${isPast?' ✅':''}</b><br><small style="color:${isPresent?'#065f46':'#666'}">${st.desc}</small>${isPresent?`<div style="background:#10b981;color:#fff;padding:5px 12px;border-radius:20px;font-size:11px;margin-top:8px;display:inline-block">🔴 LIVE - ${trackingLocation}</div>`:''}</div></div></div>`;
if(i<steps.length-1)html+=`<div style="text-align:center;color:${isPast||isPresent?'#10b981':'#e5e7eb'}">${isPresent?'⬇️ 😃 ⬇️':'⬇️'}</div>`;
});

let items=order.items||[];let sub=0;let itemHtml='';items.forEach((it,k)=>{sub+=(it.qty||1)*(it.price||0);itemHtml+=`${k+1}. ${it.name} (${it.size||'M'}) - Qty: ${it.qty||1} x ₹${it.price||0}<br>`;});
html+=`<div class="card" style="border:2px dashed #f59e0b;background:#fffbeb"><b>🛒 ${cfg.fullName}</b><br>Order ID: ${order.id}<br><br>${itemHtml}<br>Subtotal: ₹${order.subtotal||sub} | Delivery: ₹${order.deliveryCharge||80} | <b>Grand Total: ₹${order.grandTotal||sub+80}</b><br>Customer: ${order.customerName||''} | ${order.mobile||''}<br>Address: ${order.address||''}</div>`;

html+=`<div class="card">
<button type="button" class="btn btn-blue" id="btnWa" onclick="goWhatsApp()">📱 WhatsApp Help</button>
<button type="button" class="btn btn-purple" id="btnInvoice" onclick="downloadInvoicePDF()">📄 Download Invoice</button>
<button type="button" class="btn btn-green" id="btnBackOrders" onclick="goBackOrders()">📦 Back to Orders</button>
<button type="button" class="btn btn-orange" id="btnHome" onclick="goToHome()">🏠 Go to Home</button>
</div>`;

document.getElementById('root').innerHTML=html;
}
window.addEventListener('load',load);
</script>
<script>(function(){var loc=location.href.replace(/#.*$/,"");var ATTR_NAMES=["data-product-id","data-productid","data-product_id","product-id","productid","product_id","data-source-entity-id","source-entity-id","source_entity_id","data-product","data-metadata","data-meta"];var DATASET_KEYS=["productId","productid","product_id","sourceEntityId","sourceentityid","source_entity_id","product","metadata","meta"];function readProductId(value){if(typeof value!=="string"||value.length===0)return null;if(/^[0-9]{6,}$/.test(value))return value;var match=value.match(/(?:product(?:_|-)?id|source(?:_|-)?entity(?:_|-)?id)["'=:\s]+([0-9]{6,})/i);return match?match[1]:null}function extractProductId(start){for(var node=start;node&&node!==document.body;node=node.parentElement){for(var i=0;i<ATTR_NAMES.length;i++){var attrValue=node.getAttribute&&node.getAttribute(ATTR_NAMES[i]);var attrProductId=readProductId(attrValue);if(attrProductId)return attrProductId}var dataset=node.dataset||null;if(dataset){for(var j=0;j<DATASET_KEYS.length;j++){var dataValue=dataset[DATASET_KEYS[j]];var dataProductId=readProductId(dataValue);if(dataProductId)return dataProductId}}}return null}function isInlineMediaSlotElement(node){return !!(node&&node.getAttribute&&node.getAttribute("data-clippy-inline-media-slot")!==null)}function findInlineMediaSlot(start){for(var node=start;node&&node!==document.body;node=node.parentElement){if(isInlineMediaSlotElement(node))return node}return null}function readInlineMediaUrl(node){if(!node)return null;return node.getAttribute&&((node.getAttribute("data-clippy-inline-media-url")||node.getAttribute("data-url")||node.getAttribute("data_url")))||node.href||null}function stripHash(url){return String(url).replace(/#.*$/,"")}function urlsMatch(a,b){if(!a||!b)return false;try{return stripHash(new URL(a,loc).href)===stripHash(new URL(b,loc).href)}catch(_){return stripHash(a)===stripHash(b)}}function isFirstPartyReelUrl(value){try{var url=new URL(value,loc);if(url.protocol!=="https:")return false;var host=url.hostname.toLowerCase();var supported=host==="instagram.com"||host.endsWith(".instagram.com")||host==="facebook.com"||host.endsWith(".facebook.com");return supported&&/\/reels?\//i.test(url.pathname)}catch(_){return false}}function isInlineMediaUrlClick(node,href){var slot=findInlineMediaSlot(node);if(!slot)return false;var slotUrl=readInlineMediaUrl(slot);if(slotUrl)return urlsMatch(href,slotUrl);return isFirstPartyReelUrl(href)}function findDataHref(start){for(var node=start;node&&node!==document.body;node=node.parentElement){if(node.getAttribute){var href=node.getAttribute("data-href")||node.getAttribute("data-url");if(href)return{href:href,node:node}}}return null}var nativeOpen=window.open;window.open=function(url){if(parent!==window&&typeof url==="string"&&/^https?:\/\//.test(url)){parent.postMessage({type:"ecto:usercontent-link-click",href:url},"*");return null}return nativeOpen?nativeOpen.apply(window,arguments):null};document.addEventListener("click",function(e){var target=e.target instanceof Element?e.target:null;if(!target)return;if(parent===window)return;var a=target.closest?target.closest("a[href]"):null;if(a&&a.href&&/^https?:\/\//.test(a.href)&&a.href.replace(/#.*$/,"")!==loc){if(isInlineMediaUrlClick(a,a.href))return;var productId=extractProductId(target)||extractProductId(a);if(productId){e.preventDefault();parent.postMessage({type:"ecto-artifact-link-click",productId:productId},"*");return}e.preventDefault();parent.postMessage({type:"ecto:usercontent-link-click",href:a.href},"*");return}var dataHref=findDataHref(target);if(dataHref&&/^https?:\/\//.test(dataHref.href)&&dataHref.href.replace(/#.*$/,"")!==loc){if(isInlineMediaUrlClick(dataHref.node,dataHref.href))return;e.preventDefault();parent.postMessage({type:"ecto:usercontent-link-click",href:dataHref.href},"*")}},true)})();</script><script>(function(){var FOCUS_TYPE="ecto:artifact-focus-request";var CLOSE_TYPE="ecto:artifact-close-request";function focusArtifactDocument(){var body=document.body;if(!body)return;try{window.focus();}catch(e){}if(!body.hasAttribute("tabindex"))body.setAttribute("tabindex","-1");try{body.focus({preventScroll:true});}catch(e){try{body.focus();}catch(e2){}}}window.addEventListener("message",function(event){if(event.source!==window.parent)return;var data=event.data;if(!data||typeof data!=="object"||data.type!==FOCUS_TYPE)return;if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",focusArtifactDocument,{once:true});return;}focusArtifactDocument();});window.addEventListener("keydown",function(event){if(event.key!=="Escape")return;window.setTimeout(function(){if(event.defaultPrevented)return;window.parent.postMessage({type:CLOSE_TYPE},"*");},0);});})();</script></body>
</html>
