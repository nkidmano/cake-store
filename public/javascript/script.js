function editBtnView() {
  const reviews = document.querySelectorAll('.review');

  reviews.forEach(review => {
    const reviewComment = review.querySelector('.js--review__comment');
    const reviewCreate = review.querySelector('.js--review-create');
    const reviewDelete = review.querySelector('.js--review-delete');
    const editBtn = review.querySelector('.js--edit-btn');
    const cancelBtn = review.querySelector('.js--cancel-btn');
  
    if (editBtn) {
      editBtn.addEventListener('click', function() {
        reviewCreate.style.display = 'block';
        reviewComment.style.display = 'none';
        reviewDelete.style.display = 'block';
        editBtn.style.display = 'none';
      });
    }
  
    cancelBtn.addEventListener('click', function() {
      reviewCreate.style.display = 'none';
      reviewComment.style.display = 'block';
      reviewDelete.style.display = 'none';
      editBtn.style.display = 'block';
    });
  });
}
editBtnView();