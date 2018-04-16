/// <reference types="node" />

declare module 'react-images-upload'{
    export class ReactImageUploadComponent extends React.Component<SimpleSelectProps, any>{
        constructor();
          withIcon:boolean;
          buttonText:string;
          onChange:FunctionStringCallback;
    }
    
    export interface SimpleSelectProps {
        withIcon: boolean;
        buttonText: string;
        onChange: Function;
        imgExtension: string[];
        maxFileSize: number;
    }

}

