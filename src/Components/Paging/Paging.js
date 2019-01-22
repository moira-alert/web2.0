// @flow
import Paging from "retail-ui/components/Paging";
export default Paging;

// type PagingProps = {|
//     activePage: number,
//     pagesCount: number,
//     onPageChange: (pageNumber: number) => void,
// |};
//
// export default function Paging(props: PagingProps): React.Node {
//     const { activePage, pagesCount, onPageChange } = props;
//
//     return (
//         <ReactUiPaging
//             activePage={activePage}
//             pagesCount={pagesCount}
//             onPageChange={onPageChange}
//             component={PathPagingTextLink}
//         />
//     );
// }
//
// type PathPagingTextLinkProps = {
//     className?: ?string,
//     pageNumber: number | "forward",
//     onClick: () => void,
//     children: React.Node,
// };
//
// function PathPagingTextLink(props: PathPagingTextLinkProps): React.Node {
//     if (props.pageNumber === "forward") {
//         const { className, onClick, children } = props;
//         return (
//             <span className={className} onClick={onClick}>
//                 {React.Children.map(children, x => (x === "Дальше" ? "Next page" : x))}
//             </span>
//         );
//     }
//     const { className, onClick, children } = props;
//     return (
//         <span className={className} onClick={onClick}>
//             {children}
//         </span>
//     );
// }
