import React from 'react'
import Layout from '../components/layout'

import { graphql, Link } from 'gatsby'

import './blog-post.css'

export default ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout>
      <Link className="site-title" to={'/'}>
        Between Two Parens
      </Link>
      <h2 className="article__title">{post.frontmatter.title}</h2>
      <div
        className="article__content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
