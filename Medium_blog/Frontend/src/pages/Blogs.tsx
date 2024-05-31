import { Appbar } from "../components/Appbar"
import { BlogsCard } from "../components/Blogscard"
import { Skeleton } from "../components/Skeleton";
import { useBlogs } from "../hooks"

export const Blogs=()=>{
    const{blogs,loading}=useBlogs();
    if(loading){
        return <div>
            <Skeleton></Skeleton>
        </div>
    }
    return <div>
        <Appbar></Appbar>
        <div className="flex justify-center">
        
        <div className="">
            {blogs.map(blog=><BlogsCard id={blog.id} authorName={blog.author.name||"Anonymous"} title={blog.title} content={blog.content}publishedDate={"22nd feb 2023"}></BlogsCard>)}
        </div>
        </div>
    </div>
}