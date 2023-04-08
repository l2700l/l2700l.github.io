export const logo = (
  user: string,
  name: string,
  device: 'PC' | 'Mobile',
  browserName: string,
  data: any,
  orientation: 'landscape' | 'portrait',
  resolution: {width: number, height: number},
  theme: 'Dark' | 'Light',
  language: string,
  timeZone: number
) => {
  return `
            %              *%             | ${user}@${name}
         %%    %%%     %%%    %%          | ––––––––––––––––––
        %%         %%%         %%         | Device type: ${device}
         %        %% %%        %          | Device: ${(data?.device?.vendor + ' – ' + data?.device?.model) || 'unknown'}
         %%  %%%%%%%%%%%%%%%  %%          | OS: ${data?.os?.name || 'unknown'}
     %%%%%%   %%         %%   %%%%%%      | Browser: ${browserName}
  %%      %% %%   %%%%%   %% %%      %%   | Version: ${data?.browser?.version || 'unknown'}
 %%        %%    %%%%%%%    %*        %%  | Orientation: ${orientation}
  %%      %% %%   %%%%%   %% %%      %%   | Resolution: ${resolution.width}x${resolution.height}
     %%%%%%   %%         %%   %%%%%%      | Theme: ${theme}
         %%  %%%%%%%%%%%%%%%  %%          | Language: ${language}
         %        %% %%        %          | Time zone: GTM${timeZone > 0 ? '-' + timeZone/-60: '+' + timeZone/-60}
        %%         %%%         %%         | ––––––––––––––––––
         %%    %%%     %%%    %%          | Author: l2700l
            %              *%             | GitHub: github.com/l2700l
`;
};
