// Operaciones básicas de CRUD para Aprendices usando Fetch
// Asume que existen endpoints en las URLs de Django:
// - GET    /aprendices/ (lista)
// - POST   /aprendices/nuevo/ (crear)
// - GET    /aprendices/<id>/ (detalle)
// - POST   /aprendices/<id>/editar/ (actualizar)
// - POST   /aprendices/<id>/eliminar/ (eliminar)

(function () {
  const api = {
    listar: async (q = '') => {
      const url = q ? `/aprendices/?q=${encodeURIComponent(q)}` : '/aprendices/';
      const res = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      if (!res.ok) throw new Error('Error al listar aprendices');
      return await res.json().catch(() => null);
    },
    crear: async (data) => {
      const res = await fetch('/aprendices/nuevo/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error al crear aprendiz');
      return await res.json().catch(() => null);
    },
    detalle: async (id) => {
      const res = await fetch(`/aprendices/${id}/`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      if (!res.ok) throw new Error('Error al obtener detalle');
      return await res.json().catch(() => null);
    },
    actualizar: async (id, data) => {
      const res = await fetch(`/aprendices/${id}/editar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error al actualizar aprendiz');
      return await res.json().catch(() => null);
    },
    eliminar: async (id) => {
      const res = await fetch(`/aprendices/${id}/eliminar/`, {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!res.ok) throw new Error('Error al eliminar aprendiz');
      return await res.json().catch(() => null);
    }
  };

  // Exponer en window para uso desde templates
  window.AprendicesAPI = api;

  // Comportamiento de búsqueda rápida si existe el form en el header
  document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('form.sena-search');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        // Permitir funcionamiento estándar, pero podríamos interceptar si deseamos AJAX
        // e.preventDefault();
      });
    }
  });

  // Utilidad: mostrar toast de mensaje bonito
  function showToast(message, type = 'info') {
    const containerId = 'toast-container';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = 'position-fixed top-0 end-0 p-3';
      document.body.appendChild(container);
    }
    const toastEl = document.createElement('div');
    toastEl.className = 'toast sena-toast align-items-center text-bg-' + (type === 'error' ? 'danger' : type === 'success' ? 'success' : 'dark') + ' border-0';
    toastEl.role = 'alert'; toastEl.ariaLive = 'assertive'; toastEl.ariaAtomic = 'true';
    toastEl.innerHTML = '<div class="d-flex"><div class="toast-body">' + message + '</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>';
    container.appendChild(toastEl);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
    bsToast.show();
  }

  // Validación Bootstrap para formularios
  function wireBootstrapValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          showToast('Por favor, revisa los campos resaltados.', 'error');
        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  // Sugerencias simples para campos comunes
  function wireSuggestions() {
    const programa = document.querySelector('input[name="programa"], select[name="programa"]');
    if (programa && programa.tagName === 'INPUT') {
      const listId = 'programa-list';
      let datalist = document.getElementById(listId);
      if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = listId;
        datalist.innerHTML = [
          'Análisis y Desarrollo de Sistemas',
          'Seguridad y Salud en el Trabajo',
          'Química Industrial',
          'Análisis de Datos e Inteligencia Artificial'
        ].map(opt => `<option value="${opt}"></option>`).join('');
        document.body.appendChild(datalist);
      }
      programa.setAttribute('list', listId);
    }

    const ciudad = document.querySelector('input[name="ciudad"]');
    if (ciudad) {
      const listId = 'ciudad-list';
      let datalist = document.getElementById(listId);
      if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = listId;
        datalist.innerHTML = [ 'Sogamoso', 'Duitama', 'Tunja', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla' ]
          .map(opt => `<option value="${opt}"></option>`).join('');
        document.body.appendChild(datalist);
      }
      ciudad.setAttribute('list', listId);
    }
  }

  // Glow en tarjetas de inicio siguiendo el cursor
  function wireInfoTilesGlow() {
    const tiles = document.querySelectorAll('.info-tile');
    tiles.forEach((tile) => {
      tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        tile.style.setProperty('--mx', x + 'px');
        tile.style.setProperty('--my', y + 'px');
      });
      tile.addEventListener('mouseleave', () => {
        tile.style.removeProperty('--mx');
        tile.style.removeProperty('--my');
      });
    });
  }

  // Ordenación de tablas por encabezado (simple, lado cliente)
  function wireTableSort() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      const sortButtons = table.querySelectorAll('thead .table-sort');
      sortButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const col = parseInt(btn.getAttribute('data-col'), 10);
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const isAsc = !(btn.dataset.order === 'asc'); // alterna
          // limpiar estados activos
          sortButtons.forEach(b => { b.dataset.order = ''; b.classList.remove('active'); });
          btn.dataset.order = isAsc ? 'asc' : 'desc';
          btn.classList.add('active');

          rows.sort((a, b) => {
            const A = (a.children[col]?.innerText || '').trim().toLowerCase();
            const B = (b.children[col]?.innerText || '').trim().toLowerCase();
            // manejar numéricos
            const nA = parseFloat(A.replace(/[^0-9\.\-]/g, ''));
            const nB = parseFloat(B.replace(/[^0-9\.\-]/g, ''));
            if (!isNaN(nA) && !isNaN(nB)) {
              return isAsc ? nA - nB : nB - nA;
            }
            return isAsc ? A.localeCompare(B) : B.localeCompare(A);
          });

          rows.forEach(r => tbody.appendChild(r));
        });
      });
    });
  }

  function wireFormLoadingOverlay() {
    const form = document.querySelector('.form-card form[data-loading]');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) return; // ya manejado en validación
      form.classList.add('submitting');
      const overlay = form.querySelector('.loading-overlay');
      if (overlay) overlay.classList.remove('d-none');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireBootstrapValidation();
    wireSuggestions();
    wireInfoTilesGlow();
    wireTableSort();
    wireFormLoadingOverlay();
  });
})();
