(function() {
    // Ищем наш div-якорь на сайте клиента
    const container = document.getElementById('feedbackpulse-widget');
    if (!container) return;
  
    // Достаем уникальный ID виджета
    const widgetId = container.getAttribute('data-widget-id');
    if (!widgetId) return;
  
    // Создаем "окно" (iframe) для загрузки формы
    const iframe = document.createElement('iframe');
    
    // ВАЖНО: Пока мы работаем на компьютере, ссылка ведет на localhost. 
    // Перед выгрузкой в интернет мы поменяем её на твой настоящий домен!
    iframe.src = `https://feedbackpulse-sooty.vercel.app/widget/${widgetId}`;
    
    // Настраиваем внешний вид окна, чтобы оно красиво вписалось
    iframe.style.width = '100%';
    iframe.style.height = '600px'; 
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
  
    // Вставляем окно внутрь якоря
    container.appendChild(iframe);
  })();
