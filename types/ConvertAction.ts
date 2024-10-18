type ConvertAction = {
    id:string,
    filename:string,
    size:number,
    mimeType:string,
    from:string,
    file:File,
    to:string | null | undefined,
    is_converting:boolean,
    output_url: string | null | undefined,
    convert_error: string | null | undefined
  }

  export default ConvertAction