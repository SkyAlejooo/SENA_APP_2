(function(){
  const searchInput = document.getElementById('aprendizSearch');
  const filtroPrograma = document.getElementById('filtroPrograma');
  const filtroCiudad = document.getElementById('filtroCiudad');
  const tabla = document.getElementById('tablaAprendices');
  const sortButtons = tabla ? tabla.querySelectorAll('button.table-sort') : [];

  if(!tabla) return;

  // Poblar filtros con valores únicos desde la tabla
  (function populate(){
    const programas = new Set();
    const ciudades = new Set();
    tabla.querySelectorAll('tbody tr').forEach(tr=>{
      const prog = tr.getAttribute('data-programa');
      const ciu = tr.getAttribute('data-ciudad');
      if(prog) programas.add(prog);
      if(ciu) ciudades.add(ciu);
    });
    if(filtroPrograma){
      [...programas].sort().forEach(p=>{
        const opt = document.createElement('option'); opt.value=p; opt.textContent=p; filtroPrograma.appendChild(opt);
      });
    }
    if(filtroCiudad){
      [...ciudades].sort().forEach(c=>{
        const opt = document.createElement('option'); opt.value=c; opt.textContent=c; filtroCiudad.appendChild(opt);
      });
    }
  })();

  function filtrar(){
    const txt = (searchInput?.value || '').toLowerCase();
    const progFiltro = (filtroPrograma?.value || '').toLowerCase();
    const ciudadFiltro = (filtroCiudad?.value || '').toLowerCase();
    tabla.querySelectorAll('tbody tr').forEach(tr=>{
      const doc = tr.children[0].textContent.toLowerCase();
      const nombre = tr.children[1].textContent.toLowerCase();
      const apellido = tr.children[2].textContent.toLowerCase();
      const telefono = tr.children[3].textContent.toLowerCase();
      const correo = tr.children[4].textContent.toLowerCase();
      const ciudad = tr.getAttribute('data-ciudad')?.toLowerCase() || '';
      const programa = tr.getAttribute('data-programa')?.toLowerCase() || '';
      let visible = true;
      if(txt){
        visible = doc.includes(txt) || nombre.includes(txt) || apellido.includes(txt) || telefono.includes(txt) || correo.includes(txt) || ciudad.includes(txt) || programa.includes(txt);
      }
      if(visible && progFiltro){ visible = programa === progFiltro; }
      if(visible && ciudadFiltro){ visible = ciudad === ciudadFiltro; }
      tr.style.display = visible ? '' : 'none';
    });
  }

  [searchInput, filtroPrograma, filtroCiudad].forEach(el=>{
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
      const aText = a.children[colIndex].textContent.trim().toLowerCase();
      const bText = b.children[colIndex].textContent.trim().toLowerCase();
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

  document.getElementById('refreshAprendices')?.addEventListener('click', ()=>{
    if(searchInput) searchInput.value='';
    if(filtroPrograma) filtroPrograma.value='';
    if(filtroCiudad) filtroCiudad.value='';
    filtrar();
  });
})();

