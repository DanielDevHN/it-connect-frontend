import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
import { Fragment } from 'react/jsx-runtime'
import dayjs from 'dayjs'
import { IconSend } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/custom/button'
import { config } from '@/config'
import { PageLayout } from '../pagelayout';
import { GoBackLink } from '@/components/custom/gobacklink';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { incidentService } from '../incidents/incident.service';
import { Incident } from '@/schemas/incidentschema';
import { useToast } from '@/components/ui/use-toast';
import { requestService } from '../requestss/requests.service';
import { RequestSchema } from '@/schemas/requestsschema';

const socket = io(config.socketsUrl);

type Message = {
  content: string;
  userId: number;
  id: number;
  createdAt: string;
  section: string;
  sender: string;
};

export default function Comments() {
  const sectionId = useParams<{ id: string }>().id;

  const navigate = useNavigate();
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const [loading, setLoading] = useState(true);

  // Get userId from query params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const userIdNumber = userId ? parseInt(userId, 10) : null;
  const section = location.pathname.split('/')[1] === 'requestss' ? 'requests' : 'incidents';
  const username = localStorage.getItem('name');

  console.log(section, 'section');  

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const getAndSetComments = async (id: number) => {
    try {
      // Determine the service and fetch the data
      const service = section === 'incidents' ? incidentService : requestService;
      const res = await service.getEntity(id);
  
      // Navigate to 404 if not found
      if (res.status === 404) {
        navigate('/404');
        return;
      }
  
      // Handle other error statuses
      if (res.status !== 200) {
        toast({
          title: "Something went wrong.",
          description: "Couldn't fetch the data.",
        });
        return res;
      }
  
      // Extract and set comments
      const data = res.data as Incident | RequestSchema;
      const comments = data.comments || [];
      setMessages(
        comments.map((comment) => ({
          content: comment.content,
          userId: comment.userId,
          // @ts-expect-error zimon
          id: section === 'incidents' ? comment.incidentId : comment.requestId,
          createdAt: comment.createdAt,
          section,
          sender: comment.user.name
        }))
      );
      setLoading(false);
      return res;
    } catch (error) {
      // Handle unexpected errors
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error(error);
    }
  };  

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (sectionId) {
      getAndSetComments(parseInt(sectionId));
    }
    const incidentIdNumber = sectionId ? parseInt(sectionId, 10) : 0;
    if (incidentIdNumber !== 0) {
      socket.on(`${section}_${sectionId}`, (newMessage: Message) => {
        console.log(`New message received for ${section} ${sectionId}`, newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (userIdNumber !== 0 && newMessage.userId === userIdNumber) {
          setLoading(false);
        }
      });
    }

    return () => {
      socket.off(`${section}_${sectionId}`);
      socket.disconnect();
    };
  }, [sectionId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim()) {

      const userIdNumber = userId ? parseInt(userId, 10) : 0;
      const incidentIdNumber = sectionId ? parseInt(sectionId, 10) : 0;

      console.log(userId, 'userId', sectionId, 'sectionId');      

      if (userIdNumber === 0 || incidentIdNumber === 0) {
        console.error('Invalid userId or incidentId');
        return;
      }

      const newMessage = { 
        message: input, 
        userId: userIdNumber, 
        incidentId: incidentIdNumber, 
        createdAt: new Date().toISOString(),
      };

      // Emit the message with additional info like userId and incidentId
      socket.emit('newComment', { 
        content: input, 
        userId: userIdNumber,
        id: incidentIdNumber, 
        createdAt: newMessage.createdAt,
        section,
        sender: username 
      } as Message);

      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');
      setLoading(true);
    }
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <PageLayout>
      <GoBackLink />
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{`Comments`}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <section className='flex h-full gap-6 w-full'>
            <div className='flex-grow'>
              <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
                <div className='flex gap-3'>
                  <div className='flex items-center gap-2 lg:gap-4'>
                    <div>
                      <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                        {section.charAt(0).toLocaleUpperCase() + section.slice(1,-1)}{" "}{sectionId}
                      </span>
                      <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                        {section.charAt(0).toLocaleUpperCase() + section.substring(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0'>
                <div className='flex size-full flex-1'>
                  <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                    <div
                      className='chat-flex flex h-40 w-full flex-grow flex-col justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                      <Fragment>
                        {messages.map((msg, index) => (
                          <div
                            key={`${msg.userId}-${msg.createdAt}-${index}`}
                            className={cn(
                              'chat-box max-w-72 break-words px-3 py-2 shadow-lg',
                              msg.userId === userIdNumber
                                ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                                : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                            )}
                          >
                            {msg.content}{' '}
                            <span
                              className={cn(
                                'mt-1 block text-xs font-light italic text-muted-foreground',
                                msg.userId === userIdNumber && 'text-right'
                              )}
                            >
                              {msg.sender}{" "}{dayjs(msg.createdAt).format('h:mm a')}
                            </span>
                          </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                      </Fragment>
                    </div>
                  </div>
                </div>
              </div>
              <form className='flex w-full flex-none gap-2' onSubmit={sendMessage}>
                <div className='flex flex-1 items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4'>
                  <label className='flex-1'>
                    <span className='sr-only'>Chat Text Box</span>
                    <input
                      type='text'
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='Type your messages...'
                      className='h-8 w-full bg-inherit focus-visible:outline-none'
                    />
                  </label>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hidden sm:inline-flex'
                    loading={loading}
                  >
                    {
                      !loading &&
                        <IconSend size={20} />
                    }
                  </Button>
                </div>
                <Button
                  className='h-full sm:hidden'
                  rightSection={<IconSend size={18} />}
                >
                  Send
                </Button>
              </form>
            </div>
          </section>
        </CardContent>
      </Card>
    </PageLayout>
  );
}