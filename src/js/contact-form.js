export function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (!contactForm || !formStatus) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
    submitBtn.disabled = true;
    
    try {
      if (import.meta.env.DEV) {
        console.log('Form data:', Object.fromEntries(new FormData(contactForm)));
        await new Promise(resolve => setTimeout(resolve, 1000));
        formStatus.textContent = 'Demo mode: Form would submit in production';
        formStatus.className = 'form-status success';
        contactForm.reset();
        return;
      }

      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent successfully!';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formStatus.textContent = 'Error sending message. Please try again.';
      formStatus.className = 'form-status error';
      console.error('Form error:', error);
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

// Initialize when DOM is loaded
if (document.getElementById('contact-form')) {
  initContactForm();
}