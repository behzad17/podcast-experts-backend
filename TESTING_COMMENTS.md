# Testing Comment System Fixes

## What Was Fixed

1. **Comment Edit Form**: Now pre-populates with existing comment content
2. **Nested Replies**: Replies now display under their parent comments with proper indentation

## How to Test Locally

### Option 1: Test with Development Server (Recommended)

1. **Start the backend** (if not already running):
   ```bash
   python manage.py runserver
   ```

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm start
   ```

3. **Test the fixes**:
   - Navigate to an expert profile or podcast detail page
   - Post a comment
   - Click "Edit" on your comment - **the edit box should show your existing comment text**
   - Reply to a comment - **the reply should appear nested under the parent comment**

### Option 2: Test with Production Build Locally

1. **Build the frontend** (already done):
   ```bash
   cd frontend
   npm run build
   ```

2. **Collect static files**:
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **Run the server**:
   ```bash
   python manage.py runserver
   ```

4. **Test in browser** at `http://localhost:8000`

## Testing Checklist

### Edit Comment Test
- [ ] Post a comment on an expert profile or podcast
- [ ] Click the "Edit" button (three dots menu)
- [ ] **Verify**: The edit textarea should be pre-populated with your comment text
- [ ] Edit the text and save
- [ ] **Verify**: Changes are saved correctly

### Nested Replies Test
- [ ] Post a comment (parent comment)
- [ ] Click "Reply" on that comment
- [ ] Write and submit a reply
- [ ] **Verify**: The reply appears indented under the parent comment (not as a separate top-level comment)
- [ ] Post another reply to the same parent
- [ ] **Verify**: Both replies appear nested under the parent

### Edge Cases
- [ ] Edit a comment that has replies - replies should remain visible
- [ ] Delete a comment with replies - replies should also be deleted
- [ ] Cancel editing - should return to normal view without saving

## Deployment to Heroku

The build files have been committed and pushed to GitHub. To deploy to Heroku:

1. **If using Heroku Git**:
   ```bash
   git push heroku main
   ```

2. **If using GitHub integration**:
   - Heroku should auto-deploy from GitHub
   - Or manually trigger deployment from Heroku dashboard

3. **After deployment**:
   - Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
   - Test the comment system on your Heroku URL

## Troubleshooting

### If changes don't appear on Heroku:

1. **Check if build files were pushed**:
   ```bash
   git log --oneline -5
   ```
   Should see commit "Rebuild frontend with comment system fixes"

2. **Force rebuild on Heroku** (if needed):
   ```bash
   heroku restart
   ```

3. **Clear browser cache** - Old JavaScript might be cached

4. **Check browser console** for any JavaScript errors (F12)

### If edit form still doesn't show content:

- Check browser console for errors
- Verify the component file was updated: `frontend/src/components/comments/CommentSection.js`
- Look for `editingContent` state variable in the code

### If replies still appear as top-level comments:

- Check if backend returns nested structure (comments should have `replies` array)
- Check browser console for API response structure
- Verify `topLevelComments` filter is working (only shows comments with no parent)

