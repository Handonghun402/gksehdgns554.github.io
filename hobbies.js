(() => {
  const titles = { maintenance: '자동차 자가정비', hiking: '운동 · 등산', fishing: '낚시', travel: '여행' };
  const dialog = document.querySelector('#hobby-gallery');
  const image = dialog.querySelector('.gallery-image');
  const title = dialog.querySelector('#gallery-title');
  const caption = dialog.querySelector('.gallery-caption');
  const message = dialog.querySelector('.gallery-message');
  const counter = dialog.querySelector('.gallery-counter');
  const previous = dialog.querySelector('[data-gallery-prev]');
  const next = dialog.querySelector('[data-gallery-next]');
  const close = dialog.querySelector('[data-gallery-close]');
  let photos = [], index = 0, opener;
  const photoList = (key) => {
    const entries = (window.HOBBY_PHOTOS || {})[key];
    return Array.isArray(entries) ? entries.filter(p => p && typeof p.src === 'string' && p.src.trim()) : [];
  };
  const resetImage = () => {
    image.onload = null;
    image.onerror = null;
    image.hidden = true;
    image.removeAttribute('src');
  };
  function render() {
    resetImage();
    previous.hidden = next.hidden = photos.length < 2;
    counter.hidden = photos.length === 0;
    caption.textContent = '';
    message.hidden = false;
    if (!photos.length) {
      counter.textContent = '';
      message.textContent = '아직 등록된 사진이 없습니다. 사진으로 남긴 기록을 차근차근 채워갈 예정입니다.';
      return;
    }
    counter.textContent = `${index + 1} / ${photos.length}`;
    const photo = photos[index];
    const description = typeof photo.caption === 'string' ? photo.caption : '';
    caption.textContent = description;
    image.alt = description || `${title.textContent} 사진 ${index + 1}`;
    message.textContent = '사진을 불러오는 중입니다.';
    image.onload = () => { message.hidden = true; image.hidden = false; };
    image.onerror = () => { image.hidden = true; message.hidden = false; message.textContent = '사진을 불러오지 못했습니다. 다른 사진을 선택하거나 잠시 후 다시 열어주세요.'; };
    image.src = photo.src;
  }
  function move(step) {
    if (photos.length < 2) return;
    index = (index + step + photos.length) % photos.length;
    render();
  }
  document.querySelectorAll('[data-hobby]').forEach(button => {
    const key = button.dataset.hobby;
    const entries = photoList(key);
    if (entries.length) {
      const cover = document.createElement('img');
      cover.src = entries[0].src;
      cover.alt = '';
      cover.loading = 'lazy';
      cover.className = 'hobby-cover';
      cover.onerror = () => cover.remove();
      button.querySelector('.hobby-visual').append(cover);
      button.querySelector('.hobby-photo-label').textContent = `사진 ${entries.length}장 보기`;
    }
    button.addEventListener('click', () => {
      opener = button;
      photos = photoList(key);
      index = 0;
      title.textContent = titles[key];
      dialog.showModal();
      document.body.classList.add('gallery-open');
      render();
      close.focus();
    });
  });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    resetImage();
    document.body.classList.remove('gallery-open');
    if (opener) opener.focus();
  });
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
  });
})();
