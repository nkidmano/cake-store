const reviewComment = document.querySelector('.js--review__comment');
const reviewCreate = document.querySelector('.js--review-create');
const reviewDelete = document.querySelector('.js--review-delete');
const editBtn = document.querySelector('.js--edit-btn');
const cancelBtn = document.querySelector('.js--cancel-btn');

editBtn.addEventListener('click', function() {
  reviewCreate.style.display = 'block';
  reviewComment.style.display = 'none';
  reviewDelete.style.display = 'block';
  editBtn.style.display = 'none';
});

cancelBtn.addEventListener('click', function() {
  reviewCreate.style.display = 'none';
  reviewComment.style.display = 'block';
  reviewDelete.style.display = 'none';
  editBtn.style.display = 'block';
});