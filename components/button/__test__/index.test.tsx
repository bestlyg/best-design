import { cleanup, render } from '@testing-library/react';
import Button from '@best-design/button'

afterEach(cleanup);

describe('Button', () => {
    it('Test Demo', () => {
        const childText = 'child text';
        const { queryAllByText } = render(<Button>{childText}</Button>);
        expect(queryAllByText(childText)).not.toBeNull();
    });
});
