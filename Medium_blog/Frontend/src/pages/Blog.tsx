import { useParams } from 'react-router-dom';
import { useBlog } from '../hooks';
import { Appbar } from '../components/Appbar';
import { FullBlog } from '../components/FullBlog';

export const Blog = () => {
  const {id}  = useParams();

  const {loading, blog} = useBlog({
    id: id || ""
  });
  console.log(blog)
  if(loading || !blog){
    return<div>
      <Appbar/>
      <div className='h-screen flex flex-col justify-center'>
        <div className='flex justify-center'>
         
        </div>
      </div>
    </div>
  }
  return (
    <div>
      <FullBlog blog={blog}></FullBlog>
    </div>
  )
}

