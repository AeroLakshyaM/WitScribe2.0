import { supabase } from '../lib/supabase';

const questionListSelection = '*, question_likes(user_id), question_comments(count)';

const mapQuestion = (row, userId, { includeComments = false } = {}) => {
  const comments = row.question_comments || [];
  const likeRows = row.question_likes || [];
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    author: row.author_name,
    authorId: row.author_id,
    avatar: row.author_avatar,
    likes: row.like_count || 0,
    likedBy: likeRows.map((like) => like.user_id),
    isLiked: Boolean(userId && likeRows.some((like) => like.user_id === userId)),
    comments: includeComments ? comments : Array(comments[0]?.count || 0).fill(null),
    createdAt: row.created_at,
  };
};

export const listQuestions = async (userId) => {
  const { data, error } = await supabase
    .from('questions')
    .select(questionListSelection)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => mapQuestion(row, userId));
};

export const subscribeToQuestions = (onChange, onError) => supabase
  .channel('community-feed')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, onChange)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'question_likes' }, onChange)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'question_comments' }, onChange)
  .subscribe((status) => {
    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') onError?.(new Error(`Community updates unavailable (${status}).`));
  });

export const subscribeToQuestion = (questionId, onChange, onError) => supabase
  .channel(`question-${questionId}`)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'questions', filter: `id=eq.${questionId}` }, onChange)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'question_likes', filter: `question_id=eq.${questionId}` }, onChange)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'question_comments', filter: `question_id=eq.${questionId}` }, onChange)
  .subscribe((status) => {
    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') onError?.(new Error(`Question updates unavailable (${status}).`));
  });

export const createQuestion = async ({ title, description, user }) => {
  const { data, error } = await supabase.from('questions').insert({
    title: title.trim(),
    description: description.trim(),
    author_id: user.id,
    author_name: user.displayName || user.email,
    author_avatar: user.photoURL || null,
  }).select('id').single();
  if (error) throw error;
  return data.id;
};

export const toggleQuestionLike = async (questionId, userId, isLiked) => {
  const request = isLiked
    ? supabase.from('question_likes').delete().eq('question_id', questionId).eq('user_id', userId)
    : supabase.from('question_likes').upsert({ question_id: questionId, user_id: userId }, { onConflict: 'question_id,user_id', ignoreDuplicates: true });
  const { error } = await request;
  if (error) throw error;
};

export const addQuestionComment = async (questionId, user, text) => {
  const { error } = await supabase.from('question_comments').insert({
    question_id: questionId,
    author_id: user.id,
    author_name: user.displayName || user.email,
    text: text.trim(),
  });
  if (error) throw error;
};

export const getQuestionDetail = async (questionId, userId) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*, question_likes(user_id), question_comments(*)')
    .eq('id', questionId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const comments = (data.question_comments || [])
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((comment) => ({
      id: comment.id,
      author: comment.author_name,
      authorId: comment.author_id,
      text: comment.text,
      timestamp: comment.created_at,
    }));
  return mapQuestion({ ...data, question_comments: comments }, userId, { includeComments: true });
};

export const getRelatedQuestions = async (questionId, userId) => {
  const { data, error } = await supabase
    .from('questions')
    .select(questionListSelection)
    .neq('id', questionId)
    .order('like_count', { ascending: false })
    .limit(5);
  if (error) throw error;
  return (data || []).map((row) => mapQuestion(row, userId));
};

export const deleteQuestion = async (questionId) => {
  const { error } = await supabase.from('questions').delete().eq('id', questionId);
  if (error) throw error;
};

export const deleteQuestionComment = async (commentId) => {
  const { error } = await supabase.from('question_comments').delete().eq('id', commentId);
  if (error) throw error;
};
