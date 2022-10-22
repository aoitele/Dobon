import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

interface ResponseErrorValues {
  error: boolean
}

/**
 * GetServerSidePropsでエラーをクライアントに返す場合に利用する関数
 * ブラウザには404を返したいのでハードコーディングしている
 */
const throwServerSideError404 = (ctx: GetServerSidePropsContext): GetServerSidePropsResult<ResponseErrorValues>  => {
  ctx.res.statusCode = 404
  return {
    props: {
      error: true
    }
  }
}

export { throwServerSideError404 }