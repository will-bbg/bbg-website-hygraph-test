import Head from "next/head";
import Style from "../styles/Home.module.css";
import Image from "next/image";
import { GraphQLClient, gql } from "graphql-request";
import Link from "next/link";

const url = `${process.env.ENDPOINT}`;

  // instantiating a graphql client...
const graphConnect = new GraphQLClient(url);

const query = gql`
  query {
    blogPosts {
      title
      slug
      coverPhoto {
        url
      }
      excerpt
      id
      author {
        authorName
      }
    }
  }
`;

export async function getServerSideProps() {

  // making request to hygraph for posts
  const { blogPosts } = await graphConnect.request(query);

  return { props: { blogPosts } };
}

function Homepage({ blogPosts }) {
  return (
    <>
      <Head>
        <title>Blackberg Group LLC</title>
      </Head>
      <main className={Style.postcontainer}>
  {/* using array.map() method to iterate each post returned from hygraph */}
        {blogPosts.map((blogPosts) => {
          return (
            <div  key={blogPosts.id}>
              <div className={Style.inside}>
                <div className={Style.img}>
                  <Image
                    src={blogPosts.coverPhoto.url}
                    alt={blogPosts.coverPhoto.imageAlt}
                    fill
                    className={Style.imgfluid}
                  />
                </div>
                <div className={Style.container}>
                  <Link href={blogPosts.slug}>
                    <h2>{blogPosts.title}</h2>
                  </Link>
                  <p>{blogPosts.excerpt}</p>
                  <p>By {blogPosts.author.authorName}</p>
                  <Link href={blogPosts.slug}>
                    <button className={Style.readButton}>Read More</button>{" "}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </main>

   
    </>
  );
}

export default Homepage;
