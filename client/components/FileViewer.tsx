import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom'
import GeoJSONViewer from './GeoJSONViewer';
import { Result } from '../types/interfaces';
import { Empty } from 'antd';

import secureRequest from "../util/secureRequest";

interface FileViewerProps {
  resource: Result | undefined
};


const FileViewer: React.FC<FileViewerProps> = ({ resource }: FileViewerProps) => {
  let viewer;
  const [link, setLink] = useState<undefined | string>(undefined)


  useEffect( () => {
    if(resource){
      secureRequest(`/api/resource/link/${resource!.id}`, "GET").then( (data) => {
        setLink(data.url)
      }).catch( (error) => {
        console.log(error)
      }) 
    }
  }, [resource])

  if(resource != undefined && link != undefined){
    const type = resource!.type;
    const encodedUrl = encodeURIComponent(link)
    const microsoftPath = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;

    if(type == "doc" || type == "docx" || type == "document"){
      viewer = <iframe src={microsoftPath} width='100%' height='720px' />
    } else if(type == "xls" || type == "xlsx" || type == "xlsm"){
      viewer = <iframe src={microsoftPath} width='100%' height='540px' />
    } else if(type == "pdf"){
      viewer = <embed src={link} type="application/pdf" width="100%" height="720px" />
    } else if(type == "shapefile" && resource.geojson != undefined){
      try{
        viewer = <GeoJSONViewer source={resource!.geojson}></GeoJSONViewer>
      } catch(err) {
        viewer = <Empty description = {"No File Preview Available"}></Empty>
      }
    } else {
      viewer = <Empty description = {"No File Preview Available"}></Empty>
    }
  }

  if (viewer) {
      return (
        <React.Fragment>
          {viewer}
        </React.Fragment>
      );
  }
  return null;
}

export default FileViewer
