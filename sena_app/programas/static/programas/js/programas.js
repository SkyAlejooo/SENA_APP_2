(function(){
  const searchInput = document.getElementById('programaSearch');
  const filtroNivel = document.getElementById('filtroNivel');
  const filtroModalidad = document.getElementById('filtroModalidad');
  const filtroEstado = document.getElementById('filtroEstado');
  const tabla = document.getElementById('tablaProgramas');
  const sortButtons = tabla ? tabla.querySelectorAll('button.table-sort') : [];

  if(!tabla) return;

  (function populateFilters(){
    if(filtroNivel){
      const niveles = new Set();
      tabla.querySelectorAll('tbody tr').forEach(tr=>{
        const niv = tr.getAttribute('data-nivel');
        if(niv) niveles.add(niv);
      });
      [...niveles].sort().forEach(n=>{
        const opt = document.createElement('option');
        opt.value=n; opt.textContent=n; filtroNivel.appendChild(opt);
      });
    }
    if(filtroModalidad){
      const modalidades = new Set();
      tabla.querySelectorAll('tbody tr').forEach(tr=>{
        const mod = tr.getAttribute('data-modalidad');
        if(mod) modalidades.add(mod);
      });
      [...modalidades].sort().forEach(m=>{
        const opt = document.createElement('option');
        opt.value=m; opt.textContent=m; filtroModalidad.appendChild(opt);
      });
    }
  })();

  function filtrar(){
    const txt = (searchInput?.value || '').toLowerCase();
    const nivelFiltro = (filtroNivel?.value || '').toLowerCase();
    const modalidadFiltro = (filtroModalidad?.value || '').toLowerCase();
    const estadoFiltro = (filtroEstado?.value || '').toLowerCase();

    let visibles = 0;
    tabla.querySelectorAll('tbody tr').forEach(tr=>{
      const codigo = tr.children[0].textContent.toLowerCase();
      const nombre = tr.children[1].textContent.toLowerCase();
      const nivelTxt = tr.children[2].textContent.toLowerCase();
      const modalidadTxt = tr.children[3].textContent.toLowerCase();
      const centro = tr.children[5].textContent.toLowerCase();
      const regional = tr.children[6].textContent.toLowerCase();
      const nivel = tr.getAttribute('data-nivel')?.toLowerCase() || '';
      const modalidad = tr.getAttribute('data-modalidad')?.toLowerCase() || '';
      const estado = tr.getAttribute('data-estado')?.toLowerCase() || '';

      let visible = true;
      if(txt){
        visible = codigo.includes(txt) || nombre.includes(txt) || nivelTxt.includes(txt) || modalidadTxt.includes(txt) || centro.includes(txt) || regional.includes(txt);
      }
      if(visible && nivelFiltro){ visible = nivel === nivelFiltro; }
      if(visible && modalidadFiltro){ visible = modalidad === modalidadFiltro; }
      if(visible && estadoFiltro){ visible = estado === estadoFiltro; }

      tr.style.display = visible ? '' : 'none';
      if(visible) visibles++;
    });

    const badge = document.querySelector('[data-role="programas-total"]');
    if(badge){ badge.textContent = `Programas: ${visibles}`; }
  }

  [searchInput, filtroNivel, filtroModalidad, filtroEstado].forEach(el=>{
    el && el.addEventListener('input', filtrar);
    el && el.addEventListener('change', filtrar);
  });

  let sortState = {};
  function sortTable(colIndex){
    const tbody = tabla.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const current = sortState[colIndex] || 'desc';
    const nextDir = current === 'asc' ? 'desc' : 'asc';
    sortState[colIndex] = nextDir;

    rows.sort((a,b)=>{
      const aCell = a.children[colIndex];
      const bCell = b.children[colIndex];
      const aText = (aCell?.textContent || '').trim().toLowerCase();
      const bText = (bCell?.textContent || '').trim().toLowerCase();
      const aNum = Number(aText);
      const bNum = Number(bText);

      if(!Number.isNaN(aNum) && !Number.isNaN(bNum)){
        return nextDir === 'asc' ? (aNum - bNum) : (bNum - aNum);
      }
      if(aText < bText) return nextDir === 'asc' ? -1 : 1;
      if(aText > bText) return nextDir === 'asc' ? 1 : -1;
      return 0;
    });

    rows.forEach(r=>tbody.appendChild(r));
  }

  sortButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const col = parseInt(btn.getAttribute('data-col'));
      sortTable(col);
    });
  });

  document.getElementById('refreshProgramas')?.addEventListener('click', ()=>{
    if(searchInput) searchInput.value='';
    if(filtroNivel) filtroNivel.value='';
    if(filtroModalidad) filtroModalidad.value='';
    if(filtroEstado) filtroEstado.value='';
    filtrar();
  });
})();

