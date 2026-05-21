const findings = {
  cookie: {
    title: "Secure Cookie 미설정",
    severity: "High",
    pill: "danger",
    evidence: "SESSIONID Cookie에 Secure 속성이 없음. Cookie Value는 [MASKED] 처리됨.",
    mapping: "A02 Cryptographic Failures / CWE-614",
    impact: "HTTPS 환경에서도 비보안 채널 전송 가능성이 존재할 수 있음.",
    verify: "브라우저 개발자 도구 Application > Cookies에서 Secure 속성을 확인.",
    fp: "비인증 Cookie이거나 내부 테스트 환경이면 실제 영향도가 낮을 수 있음."
  },
  storage: {
    title: "LocalStorage Token 저장 의심",
    severity: "High",
    pill: "danger",
    evidence: "LocalStorage key 목록에서 accessToken이 확인됨. 값은 수집하지 않음.",
    mapping: "A02 Cryptographic Failures / CWE-922",
    impact: "브라우저 스크립트 접근 가능 영역에 인증 관련 값이 저장될 가능성이 있음.",
    verify: "토큰 값의 성격, 만료 정책, HttpOnly Cookie 대체 가능성을 검토.",
    fp: "key 이름만으로 실제 민감정보 여부를 확정할 수 없어 담당자 검토가 필요함."
  },
  csp: {
    title: "Content-Security-Policy 미설정",
    severity: "Medium",
    pill: "neutral",
    evidence: "Response Header에서 Content-Security-Policy가 확인되지 않음.",
    mapping: "A05 Security Misconfiguration / CWE-693",
    impact: "XSS 발생 시 브라우저 레벨의 추가 방어 정책이 적용되지 않을 수 있음.",
    verify: "curl -I 또는 브라우저 개발자 도구 Network 탭에서 응답 헤더 확인.",
    fp: "Gateway에서 CSP를 주입하거나 내부망 전용 서비스인 경우 영향도가 낮을 수 있음."
  },
  server: {
    title: "Server Header 정보노출",
    severity: "Low",
    pill: "success",
    evidence: "Response Header에 서버 제품 또는 버전 정보가 노출될 가능성이 있음.",
    mapping: "A05 Security Misconfiguration / CWE-200",
    impact: "공격자가 환경 정보를 추정하는 데 참고 자료로 사용할 수 있음.",
    verify: "Server, X-Powered-By 등 불필요한 응답 헤더 노출 여부 확인.",
    fp: "버전 정보가 제거되어 있거나 Gateway에서 일반화된 값일 수 있음."
  }
};

const targetUrl = document.getElementById("targetUrl");
const domainState = document.getElementById("domainState");
const runScan = document.getElementById("runScan");
const detailTitle = document.getElementById("detailTitle");
const detailSeverity = document.getElementById("detailSeverity");
const detailEvidence = document.getElementById("detailEvidence");
const detailMapping = document.getElementById("detailMapping");
const detailImpact = document.getElementById("detailImpact");
const detailVerify = document.getElementById("detailVerify");
const detailFp = document.getElementById("detailFp");

document.querySelectorAll(".mode").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll(".finding").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".finding").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");

    const detail = findings[button.dataset.finding];
    detailTitle.textContent = detail.title;
    detailSeverity.textContent = detail.severity;
    detailSeverity.className = `pill ${detail.pill}`;
    detailEvidence.textContent = detail.evidence;
    detailMapping.textContent = detail.mapping;
    detailImpact.textContent = detail.impact;
    detailVerify.textContent = detail.verify;
    detailFp.textContent = detail.fp;
  });
});

targetUrl.addEventListener("input", () => {
  const host = safeHost(targetUrl.value);
  const allowed = host.endsWith(".company.co.kr") || host === "localhost" || host === "127.0.0.1";
  domainState.textContent = allowed ? "Approved" : "Blocked";
  domainState.className = allowed ? "pill success" : "pill danger";
});

runScan.addEventListener("click", () => {
  runScan.textContent = "분석 완료";
  setTimeout(() => {
    runScan.textContent = "분석 시작";
  }, 1400);
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function safeHost(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

// --- Frontend scaffold: dummy assets rendering ---
let assets = [];

async function loadAssets() {
  try {
    const res = await fetch('./data/sample-assets.json');
    if (!res.ok) throw new Error('Fetch failed');
    const body = await res.json();
    assets = body.assets || [];
  } catch (e) {
    // fallback to inline sample if fetch fails
    assets = [
      { id: 'asset-001', name: 'service.company.co.kr', subdomain: 'service.company.co.kr', ip: '10.1.2.34', status: 'active', asset_type: 'web', critical: 2, high: 1, last_seen: '2026-05-21T10:12:00' },
      { id: 'asset-002', name: 'api.company.co.kr', subdomain: 'api.company.co.kr', ip: '10.1.2.35', status: 'active', asset_type: 'api', critical: 0, high: 1, last_seen: '2026-05-20T16:20:00' }
    ];
  }
  renderAssets();
}

function renderAssets() {
  const container = document.getElementById('assetsList');
  if (!container) return;
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'assets-grid';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>ID</th><th>Name</th><th>IP</th><th>Type</th><th>Status</th><th>Critical</th><th>High</th><th>Last Seen</th></tr>';
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  assets.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.id}</td>
      <td><a href="#" class="asset-link" data-asset-id="${a.id}">${a.name}</a></td>
      <td>${a.ip}</td>
      <td>${a.asset_type}</td>
      <td>${a.status}</td>
      <td>${a.critical}</td>
      <td>${a.high}</td>
      <td>${a.last_seen}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);

  // attach click handlers
  container.querySelectorAll('a.asset-link').forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const id = a.dataset.assetId;
      const asset = assets.find(x => x.id === id);
      if (asset) showAssetDetail(asset);
    });
  });
}

function showAssetDetail(asset) {
  document.getElementById('detail_asset_id').textContent = asset.id || '-';
  document.getElementById('detail_name').textContent = asset.name || '-';
  document.getElementById('detail_subdomain').textContent = asset.subdomain || '-';
  document.getElementById('detail_ip').textContent = asset.ip || '-';
  document.getElementById('detail_type').textContent = asset.asset_type || '-';
  document.getElementById('detail_status').textContent = asset.status || '-';
  document.getElementById('detail_critical').textContent = asset.critical ?? '-';
  document.getElementById('detail_high').textContent = asset.high ?? '-';
  document.getElementById('detail_last_seen').textContent = asset.last_seen || '-';

  // optional: focus/open analysis view
  document.getElementById('openInDetailPanel')?.addEventListener('click', () => {
    // scroll to findings/detail section for now
    document.querySelector('#findings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadAssets();
  document.getElementById('refreshAssets')?.addEventListener('click', loadAssets);
});
