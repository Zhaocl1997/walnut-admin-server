import { request } from 'http';

export const baiduUrl = `http://api.map.baidu.com/location/ip`;

export const getLocationThroughIP = ({
  ak,
  ip,
}: {
  ak: string;
  ip: string;
}) => {
  return new Promise<string>((resolve, reject) => {
    const client = request(`${baiduUrl}?ak=${ak}&ip=${ip}`, (res) => {
      res.on('data', (chunk) => {
        const res = JSON.parse(chunk.toString());

        if (res.status === 1001) {
          resolve(undefined);
          return;
        }

        const location = res?.content?.address;

        resolve(location);
      });
    });

    client.on('error', (e) => {
      reject(e);
    });

    client.end();
  });
};
