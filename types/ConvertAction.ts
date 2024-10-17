type ConvertAction = {
    id:string,
    filename:string,
    size:number,
    mimeType:string,
    from:string,
    to:string | null | undefined,
  }

  export default ConvertAction