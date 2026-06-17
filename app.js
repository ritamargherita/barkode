const API_BASE_URL = "https://barkode-api.m-martorana.workers.dev";

function renderGuidelineSource(source) {
  const tableContainer = document.getElementById("guidelineSourceTable");
  const linkContainer = document.getElementById("guidelineSourceLinks");

  if (!tableContainer || !linkContainer) {
    return;
  }

  tableContainer.innerHTML = `
    <table class="guideline-table">
      <tbody>
        ${source.rows
          .map(
            ([label, value]) => `
              <tr>
                <th scope="row">${label}</th>
                <td>${value}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
    ${source.notice ? `<p class="source-notice">${source.notice}</p>` : ""}
  `;

  linkContainer.innerHTML = source.links
    .map(
      (link) => `
        <a href="${link.href}" target="_blank" rel="noreferrer">
          ${link.label}
        </a>
      `
    )
    .join("");
}

async function loadGuidelineSource() {
  const tableContainer = document.getElementById("guidelineSourceTable");

  try {
    const response = await fetch(`${API_BASE_URL}/v1/guideline-source`, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Guideline source request failed with ${response.status}`);
    }

    const payload = await response.json();
    renderGuidelineSource(payload.data);
  } catch {
    if (tableContainer) {
      tableContainer.innerHTML =
        '<p class="source-loading">Guideline source details are temporarily unavailable. Please try again later.</p>';
    }
  }
}

loadGuidelineSource();
