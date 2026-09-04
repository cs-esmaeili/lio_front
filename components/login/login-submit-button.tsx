import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/login/spinner';

type Props = {
  loading: boolean;
  text: string;
};

export function LoginSubmitButton({ loading, text }: Props) {
  return (
    <Button
      type='button'
      disabled={loading}
      className='w-full rounded-lg py-6 cursor-pointer'
    >
      {loading ? (
        <span className='flex items-center justify-center gap-2'>
          <Spinner />
          در حال پردازش...
        </span>
      ) : (
        text
      )}
    </Button>
  );
}
